import {userMention} from '@discordjs/builders';
import {
  type AnyChannel,
  Client,
  Intents
} from 'discord.js';
import {logger} from './logger.js';

export const client: Client = new Client({intents: [Intents.FLAGS.GUILDS]});

export async function remindUser (channel: string, message: string, author: string): Promise<void> {
  logger.debug(`Reminding ${author} about ${message}`);

  const reminder = `${userMention(author)} ${message}`;
  const chat = await client.channels.fetch(channel);

  if (chat?.type === 'GUILD_TEXT' || chat?.type === 'DM') {
    await chat.send(reminder);
  }
}

export function getChannel (id: string): AnyChannel | undefined {
  return client.channels.cache.get(id);
}

export function ping (): number {
  return client.ws.ping;
}
