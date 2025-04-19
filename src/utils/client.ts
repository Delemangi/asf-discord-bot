import { Client, GatewayIntentBits } from 'discord.js';

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

export const getChannel = (channelId: string) =>
  client.channels.cache.get(channelId);
