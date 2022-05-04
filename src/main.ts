import {readdirSync} from 'node:fs';
import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v10';
import {Collection} from 'discord.js';
import {client} from './utils/client.js';
import {configuration} from './utils/config.js';
import {logger} from './utils/logger.js';
import {longReplyToInteraction} from './utils/printing.js';
import {loadReminders} from './utils/reminder.js';
import {
  initDB,
  loadTables
} from './utils/sql.js';
import {getString} from './utils/strings.js';
import {
  initWS,
  sendLog
} from './utils/ws.js';

const files: string[] = readdirSync('./dist/commands').filter((file) => file.endsWith('.js'));
const botCommands: Collection<string, Command> = new Collection();
const commandsToDeploy: string[] = [];

for (const [index, file] of files.entries()) {
  const command: Command = await import(`./commands/${file}`);
  botCommands.set(command.data.name, command);
  commandsToDeploy.push(command.data.toJSON());

  logger.debug(`Command #${index + 1}: ${command.data.name}`);
}

const rest: REST = new REST({version: '10'}).setToken(configuration('token') as string);

for (const guild of configuration('guildIDs') as string[]) {
  try {
    await rest.put(Routes.applicationGuildCommands(configuration('clientID') as string, guild), {body: commandsToDeploy});

    logger.debug(`Deployed commands in ${guild}`);
  } catch (error) {
    logger.error(`Failed to deploy commands in ${guild}\n${error}`);
  }
}

try {
  await client.login(configuration('token') as string);

  logger.info('Bot successfully logged in');
} catch (error) {
  logger.error(`Bot couldn't log in\n${error}`);
}

client.on('interactionCreate', async (interaction) => {
  if (interaction.isCommand()) {
    const command = botCommands.get(interaction.commandName);

    if (!command) {
      return;
    }

    logger.info(`${interaction.user.tag}: ${interaction} [${interaction.guild?.id} - ${interaction.guild?.name}]`);

    try {
      await interaction.deferReply();
      await command.execute(interaction);

      logger.debug(`Interaction ${interaction.id} handled`);
    } catch (error) {
      await longReplyToInteraction(interaction, getString('unknownError'));

      logger.error(`Failed to handle interaction ${interaction}\n${error}`);
    }
  }
});

client.once('ready', async () => {
  client.user?.setActivity('World Domination');

  const guilds: string[] = client.guilds.cache.map((guild) => `${guild.id} - ${guild.name}`);

  logger.info('Servers:');
  for (const [index, guild] of guilds.entries()) {
    logger.info(`${index + 1}.\t${guild}`);
  }

  initWS();
  sendLog().catch((error) => logger.error(`Failed to send log\n${error}`));

  await initDB();
  await loadTables();
  loadReminders().catch((error) => logger.error(`Failed to load reminders\n${error}`));
});
