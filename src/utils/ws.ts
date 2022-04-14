import type {Client} from 'discord.js';
import {WebSocket} from 'ws';
import {configuration} from './config';
import {logger} from './logger';
import {printLog} from './printing';

let buffer: string[] = [];

export async function initWS (client: Client): Promise<void> {
  const ws = new WebSocket(configuration('asfWS'), {
    headers: {
      Authentication: configuration('asfPassword'),
      'Content-Type': 'application/json'
    }
  });

  setInterval(() => sendToWS(client), 5_000);

  ws.on('message', (data) => buffer.push(JSON.parse(data.toString()).Result));

  ws.on('close', (code) => {
    logger.error(`The WS connection was closed\n${code}`);
    logger.debug('Attempting to reconnect to WS again in 10 seconds...');
    setTimeout(() => initWS(client), 10_000);
  });

  ws.on('error', (error) => logger.error(`Encountered WS error\n${error}`));
}

async function sendToWS (client: Client): Promise<void> {
  const logs: string = buffer.join('\n');
  buffer = [];

  if (!logs.length) {
    return;
  }

  for (const channel of configuration('asfLogChannels')) {
    const textChannel = client.channels.cache.get(channel);

    if (textChannel?.type === 'GUILD_TEXT') {
      try {
        await printLog(textChannel, logs);
      } catch (error) {
        logger.error(`Failed to print ASF log\n${error}`);
      }
    }
  }
}
