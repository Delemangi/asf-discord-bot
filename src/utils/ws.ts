import {setTimeout as setTimeoutPromise} from 'node:timers/promises';
import {WebSocket} from 'ws';
import {configuration} from './config.js';
import {logger} from './logger.js';
import {printLog} from './printing.js';

let buffer: string[] = [];

export function initWS (): void {
  const headers = {
    Authentication: configuration('ASFPassword'),
    'Content-Type': 'application/json'
  };
  const ws = new WebSocket(configuration('ASFWS'), {headers});

  ws.on('message', (data) => buffer.push(JSON.parse(data.toString()).Result));
  ws.on('error', (error) => logger.error(`Encountered WS error\n${JSON.stringify(error)}`));
  ws.on('close', (code) => {
    logger.error(`The WS connection was closed\n${code}`);
    logger.debug('Attempting to reconnect to WS again in 10 seconds...');

    setTimeout(initWS, 10_000);
  });
}

export async function sendLog (): Promise<void> {
  while (true) {
    logger.debug('Checking if there is ASF log to be sent');

    const logs = buffer.join('\n');
    buffer = [];

    if (logs.length > 0) {
      for (const channel of configuration('ASFLogChannels')) {
        try {
          await printLog(channel, logs);
        } catch (error) {
          logger.error(`Failed to print ASF log to channel ${channel}\n${error}`);
        }
      }
    }

    await setTimeoutPromise(5_000);
  }
}
