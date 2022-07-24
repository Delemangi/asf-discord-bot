import {
  type Channel,
  ChannelType,
  Client,
  GatewayIntentBits,
  userMention,
  ActivityType
} from 'discord.js';
import {configuration} from './config.js';
import {logger} from './logger.js';

const mode = configuration('devMode');

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ],
  presence: {
    activities: [{
      name: `${mode ? 'Testing...' : 'World Domination'}`,
      type: mode ? ActivityType.Watching : ActivityType.Playing
    }],
    status: `${mode ? 'dnd' : 'online'}`
  }
});

export async function remindUser (channel: string, message: string, author: string): Promise<void> {
  logger.debug(`Reminding ${author} about ${message}`);

  const reminder = `<${userMention(author)}> Reminder: ${message}`;
  const chat = await client.channels.fetch(channel);

  if (chat?.type === ChannelType.GuildText || chat?.type === ChannelType.DM || chat?.type === ChannelType.GuildPublicThread || chat?.type === ChannelType.GuildPrivateThread) {
    await chat.send(reminder);
  }
}

export function getChannel (id: string): Channel | undefined {
  return client.channels.cache.get(id);
}

export function ping (): number {
  return client.ws.ping;
}
