import {setTimeout as setTimeoutPromise} from 'node:timers/promises';
import {WebSocket} from 'ws';
import {configuration} from './config.js';
import {logger} from './logger.js';
import {printLog} from './printing.js';

let buffer: string[] = [];

export function initWS (): void {
  const headers: {[index: string]: string} = {
    Authentication: configuration('ASFPassword') as string,
    'Content-Type': 'application/json'
  };
  const ws: WebSocket = new WebSocket(configuration('ASFWS') as string, {headers});

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
    const logs: string = buffer.join('\n');
    buffer = [];

    if (logs.length === 0) {
      return;
    }

    for (const channel of configuration('ASFLogChannels') as string[]) {
      try {
        await printLog(channel, logs);
      } catch (error) {
        logger.error(`Failed to print ASF log\n${error}`);
      }
    }

    await setTimeoutPromise(5_000);
  }
}
