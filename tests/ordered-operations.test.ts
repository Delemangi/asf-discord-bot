import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const sources = {
  asf: readFileSync('src/utils/asf.ts', 'utf8'),
  printing: readFileSync('src/utils/printing.ts', 'utf8'),
  ws: readFileSync('src/utils/ws.ts', 'utf8'),
};

// Evaluate the real module with explicit boundary replacements: no config,
// credentials, Discord client, network connection, or real timer is loaded.
const loadModule = (
  file: keyof typeof sources,
  mocks: Record<string, unknown>,
  globals: Record<string, unknown> = {},
): unknown => {
  const exports = {};
  const { outputText } = ts.transpileModule(sources[file], {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ESNext,
    },
  });
  // eslint-disable-next-line sonarjs/code-eval -- Only fixed local source files above are evaluated, with all external boundaries mocked.
  runInNewContext(outputText, {
    Array,
    exports,
    Promise,
    require: (id: string) => {
      assert.ok(Object.hasOwn(mocks, id), `Unexpected import: ${id}`);
      return mocks[id];
    },
    ...globals,
  });
  return exports;
};

test('split replies and logs are sequential; first replies honor deferral and failures stop delivery', async () => {
  type Interaction = {
    deferred: boolean;
    editReply: (text: string) => Promise<void>;
    followUp: (text: string) => Promise<void>;
    reply: (text: string) => Promise<void>;
  };
  const events: Array<{ kind: string; text: string }> = [];
  let active = 0;
  const send = (kind: string) => async (text: string) => {
    assert.equal(active, 0, 'Sends must not overlap');
    active++;
    events.push({ kind, text });
    await Promise.resolve();
    active--;
  };
  type PrintingModule = {
    longReplyToInteraction: (
      interaction: Interaction,
      message: string,
    ) => Promise<void>;
    printLog: (channel: string, message: string) => Promise<void>;
  };
  const printing = loadModule('printing', {
    './client.js': {
      getChannel: () => ({ isSendable: () => true, send: send('log') }),
    },
    './logger.js': { logger: { warn() {} } },
    './strings.js': { getString: (key: string) => key },
    'discord.js': {
      codeBlock: (...args: string[]) => args.at(-1),
      inlineCode: (text: string) => text,
    },
  }) as PrintingModule;
  const interaction: Interaction = {
    deferred: true,
    editReply: send('edit'),
    followUp: send('follow'),
    reply: send('reply'),
  };
  const message = 'a'.repeat(1_950) + 'b'.repeat(1_950) + 'c'.repeat(100);
  await printing.longReplyToInteraction(interaction, message);
  assert.deepEqual(
    events.map(({ kind, text }) => [kind, text.length]),
    [
      ['edit', 1_950],
      ['follow', 1_950],
      ['follow', 100],
    ],
  );
  assert.equal(events.map(({ text }) => text).join(''), message);

  events.length = 0;
  interaction.deferred = false;
  await printing.longReplyToInteraction(interaction, '');
  assert.deepEqual(events, [{ kind: 'reply', text: 'emptyMessage' }]);

  events.length = 0;
  await printing.printLog('offline', message);
  assert.deepEqual(
    events.map(({ kind }) => kind),
    ['log', 'log', 'log'],
  );
  assert.equal(events.map(({ text }) => text).join(''), message);

  events.length = 0;
  interaction.reply = async () => {
    await Promise.resolve();
    throw new Error('stop');
  };
  await assert.rejects(printing.longReplyToInteraction(interaction, message), {
    message: 'stop',
  });
  assert.deepEqual(events, [], 'No follow-up may run after a failed reply');
});

test('ASF requests preserve account order, permissions, empty-account skipping, and fail-fast errors', async () => {
  const requests: string[] = [];
  let active = 0;
  let fail = false;
  type AsfModule = {
    sendPrivilegedASFRequest: (
      interaction: { user: { id: string } },
      command: string,
      options: { args: string },
    ) => Promise<string>;
  };
  const asf = loadModule(
    'asf',
    {
      '../types/AsfResponse.js': {
        asfResponseSchema: { parse: (value: unknown) => value },
      },
      './config.js': {
        configuration: (key: string) =>
          key === 'ASFPermissions' ? { user: ['a', 'b'] } : 'unused',
        getASFAddress: () => 'offline',
      },
      './logger.js': { logger: { error() {} } },
      './strings.js': { getString: (key: string) => key },
    },
    {
      fetch: async (_url: string, options: { body: string }) => {
        assert.equal(active, 0, 'Requests must not overlap');
        active++;
        const { Command: command } = JSON.parse(options.body) as {
          Command: string;
        };
        requests.push(command);
        await Promise.resolve();
        active--;
        if (fail) {
          throw new Error('request failed');
        }
        return { json: () => Promise.resolve({ Result: command }), ok: true };
      },
    },
  ) as AsfModule;
  const interaction = { user: { id: 'user' } };
  assert.equal(
    await asf.sendPrivilegedASFRequest(interaction, 'status', {
      args: 'a,,denied,b',
    }),
    'status a\n<denied> noBotPermission\nstatus b',
  );
  assert.deepEqual(requests, ['status a', 'status b']);
  requests.length = 0;
  fail = true;
  await assert.rejects(
    asf.sendPrivilegedASFRequest(interaction, 'status', { args: 'a,b' }),
    { message: 'request failed' },
  );
  assert.deepEqual(requests, ['status a']);
});

test('websocket pump drains batches sequentially, isolates channel failures, and retains delays', async () => {
  const events: string[] = [];
  const handlers = new Map<string, (value: unknown) => void>();
  const emit = (name: string, value: unknown) => {
    const handler = handlers.get(name);
    assert.ok(handler, `Missing websocket handler: ${name}`);
    handler(value);
  };
  const stop = new Error('stop after two batches');
  let delays = 0;
  type WsModule = {
    initializeWS: () => void;
    sendASFLogs: () => Promise<void>;
  };
  const ws = loadModule(
    'ws',
    {
      '../types/AsfResponse.js': {
        asfResponseSchema: { parse: (value: unknown) => value },
      },
      './config.js': {
        configuration: (key: string) =>
          key === 'ASFLogChannels' ? ['first', 'second'] : 'unused',
        getASFAddress: () => 'offline',
      },
      './logger.js': {
        logger: {
          error: () => {
            events.push('error');
          },
        },
      },
      './printing.js': {
        printLog: async (channel: string, logs: string) => {
          events.push(`${channel}:${logs}`);
          await Promise.resolve();
          if (channel === 'first') {
            throw new Error('channel failure');
          }
        },
      },
      'node:timers/promises': {
        setTimeout: async (ms: number) => {
          events.push(`delay:${ms}`);
          delays++;
          if (delays === 2) {
            throw stop;
          }
          emit('message', Buffer.from('{"Result":"next"}'));
          await Promise.resolve();
        },
      },
      ws: {
        WebSocket: class {
          on(name: string, handler: (value: unknown) => void) {
            handlers.set(name, handler);
            return this;
          }
        },
      },
    },
    {
      Buffer,
      Error,
      setTimeout: (_callback: unknown, ms: number) => {
        events.push(`reconnect:${ms}`);
      },
    },
  ) as WsModule;
  ws.initializeWS();
  emit('message', Buffer.from('{"Result":"initial"}'));
  emit('close', 1_000);
  await assert.rejects(ws.sendASFLogs(), (error: unknown) => error === stop);
  assert.deepEqual(events, [
    'error',
    'reconnect:10000',
    'first:initial',
    'error',
    'second:initial',
    'delay:5000',
    'first:next',
    'error',
    'second:next',
    'delay:5000',
  ]);
});
