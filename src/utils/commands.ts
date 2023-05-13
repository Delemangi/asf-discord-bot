import { configuration } from './config.js';
import { logger } from './logger.js';
import { REST } from '@discordjs/rest';
import { Collection } from 'discord.js';
import { Routes } from 'discord-api-types/v10';
import { readdirSync } from 'node:fs';

export const commands = new Collection<string, Command>();

const applicationID = configuration('applicationID');

const rest = new REST();
rest.setToken(configuration('token'));

export const readCommands = async () => {
  for (const cmd of readdirSync('./dist/commands').filter((file) =>
    file.endsWith('.js'),
  )) {
    const command: Command = await import(`../commands/${cmd}`);
    commands.set(command.data.name, command);
  }
};

export const registerCommands = async () => {
  try {
    await rest.put(Routes.applicationCommands(applicationID), {
      body: commands.map((command) => command.data.toJSON()),
    });

    logger.info('Successfully registered commands');
  } catch (error) {
    throw new Error(`Failed registering commands: ${error}`);
  }
};
