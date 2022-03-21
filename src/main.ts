import {readdirSync} from 'fs';
import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import {
  Client,
  Collection,
  Intents
} from 'discord.js';
import {config} from './config';
import {logger} from './utils/logger';
import {replyToInteraction} from './utils/printing';
import {loadReminders} from './utils/reminder';
import {
  loadDB,
  loadTables
} from './utils/sql';
import {startWS} from './utils/ws';

export const client: Client = new Client({
  intents: [
    Intents.FLAGS.GUILDS
  ]
});
const files: string[] = readdirSync('./dist/commands').filter((file) => file.endsWith('.js'));
const botCommands: Collection<string, NodeJS.Require> = new Collection();
const commandsToDeploy: string[] = [];

for (const [index, file] of files.entries()) {
  const command = require(`./commands/${file}`);
  botCommands.set(command.data.name, command);
  commandsToDeploy.push(command.data.toJSON());

  logger.debug(`Command #${index}: ${command.data.name}`);
}

const rest: REST = new REST({version: '9'}).setToken(config.token);
for (const guild of config.guildIDs) {
  rest.put(Routes.applicationGuildCommands(config.clientID, guild), {body: commandsToDeploy})
    .then(() => logger.debug(`Deployed commands in ${guild}`))
    .catch((error) => logger.error(`Failed to deploy commands in ${guild}\n${error}`));
}

client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    const command: any = botCommands.get(interaction.commandName);

    if (!command) {
      return;
    }

    logger.info(`${interaction.user.tag}: ${interaction} [${interaction.guild?.id} - ${interaction.guild?.name}]`);

    try {
      await command.execute(interaction);
    } catch (error) {
      await replyToInteraction(interaction, 'Failed to process interaction.');
      logger.error(`Failed to process interaction ${interaction}\n${error}`);
    }
  }
});

client.once('ready', () => {
  client.user?.setActivity('World Domination');

  const guilds: string[] = client.guilds.cache.map((guild) => `${guild.id} - ${guild.name}`);

  logger.info('Servers:');
  for (const [index, guild] of guilds.entries()) {
    logger.info(`${index}.\t${guild}`);
  }

  startWS(client)
    .then(() => logger.debug('Established WS connection with ASF'))
    .catch((error) => logger.error(`Failed to establish WS connection with ASF\n${error}`));

  loadDB()
    .then(() => loadTables())
    .then(() => loadReminders());
});

export async function sendMessage (channel: string, message: string, author: string): Promise<void> {
  const reminder: string = `<@${author}> ${message}`;

  client.channels.fetch(channel)
    .then((chat) => {
      if (chat?.type === 'GUILD_TEXT') {
        chat.send(reminder);
      }
    });
}

export function ping (): number {
  return client.ws.ping;
}

client.login(config.token);
