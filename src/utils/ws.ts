import { setTimeout as setTimeoutPromise } from 'node:timers/promises';
import { WebSocket } from 'ws';

import { asfResponseSchema } from '../types/AsfResponse.js';
import { configuration, getASFAddress } from './config.js';
import { logger } from './logger.js';
import { printLog } from './printing.js';

const endpoint = '/api/nlog';
const buffer: string[] = [];

export const initializeWS = () => {
  const headers = {
    Authentication: configuration('ASFPassword'),
    'Content-Type': 'application/json',
  };
  const ws = new WebSocket(`ws://${getASFAddress()}${endpoint}`, {
    headers,
  });

  ws.on('message', (data: Buffer) => {
    const json = asfResponseSchema.parse(JSON.parse(data.toString('utf8')));
    buffer.push(json.Result);
  });
  ws.on('error', (error) =>
    logger.error(`Encountered WS error\n${JSON.stringify(error)}`),
  );
  ws.on('close', (code) => {
    logger.error(`The WS connection was closed\n${code}`);

    setTimeout(initializeWS, 10_000);
  });
};

const sendASFLogBatch = async () => {
  const logs = buffer.join('\n');
  buffer.length = 0;

  if (logs.length === 0) {
    return;
  }
  await Array.fromAsync(configuration('ASFLogChannels'), async (channel) => {
    try {
      await printLog(channel, logs);
    } catch (error) {
      logger.error(`Failed to print ASF log to channel ${channel}\n${error}`);
    }
    return true;
  });
};

export const sendASFLogs = () =>
  new Promise<void>((_resolve, reject) => {
    const sendNextBatch = async () => {
      try {
        await sendASFLogBatch();
        await setTimeoutPromise(5_000);
        // Do not retain an ever-growing chain of promises for this infinite pump.
        void sendNextBatch();
      } catch (error) {
        reject(
          error instanceof Error
            ? error
            : new Error(String(error), { cause: error }),
        );
      }
    };

    void sendNextBatch();
  });
