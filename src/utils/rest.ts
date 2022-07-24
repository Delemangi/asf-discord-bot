import {readdirSync} from 'node:fs';
import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v10';
import {Collection} from 'discord.js';
import {configuration} from './config.js';
import {logger} from './logger.js';

export const commands = new Collection<string, Command>();
const commandsJSON: string[] = [];

const mode = configuration('devMode');
const applicationID = configuration('applicationID');

const rest = new REST();
rest.setToken(configuration('token'));

export async function getCommands (): Promise<void> {
  const files = readdirSync('./dist/commands').filter((file) => file.endsWith('.js'));

  for (const [index, file] of files.entries()) {
    const command: Command = await import(`../commands/${file}`);
    commands.set(command.data.name, command);
    commandsJSON.push(command.data.toJSON());

    logger.debug(`Command #${index + 1}: ${command.data.name}`);
  }
}

export async function registerCommands (): Promise<void> {
  if (mode) {
    for (const guild of configuration('guilds')) {
      try {
        await rest.put(Routes.applicationGuildCommands(applicationID, guild), {body: commandsJSON});

        logger.debug(`Deployed slash commands in ${guild}`);
      } catch (error) {
        logger.error(`Failed to deploy slash commands in ${guild}: ${error}`);
      }
    }
  } else {
    try {
      await rest.put(Routes.applicationCommands(applicationID), {body: commandsJSON});

      logger.debug('Deployed slash commands globally');
    } catch (error) {
      throw new Error(`Failed to deploy slash commands globally: ${error}`);
    }
  }
}
