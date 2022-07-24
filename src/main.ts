import {ChannelType} from 'discord-api-types/v10';
import {client} from './utils/client.js';
import {configuration} from './utils/config.js';
import {logger} from './utils/logger.js';
import {longReplyToInteraction} from './utils/printing.js';
import {loadReminders} from './utils/reminder.js';
import {
  commands,
  getCommands,
  registerCommands
} from './utils/rest.js';
import {
  initDB,
  loadTables
} from './utils/sql.js';
import {getString} from './utils/strings.js';
import {
  initWS,
  sendLog
} from './utils/ws.js';

const token = configuration('token');
const applicationID = configuration('applicationID');

if (token === '' || applicationID === '') {
  throw new Error('The bot token or application ID have not been set. Please set them and restart the bot.');
}

const ASFAPI = configuration('ASFAPI');
const ASFWS = configuration('ASFWS');

if (ASFAPI === '' || ASFWS === '') {
  throw new Error('The ASF API or WS URLs have not been set. Please set them and restart the bot.');
}

const ASFPassword = configuration('ASFPassword');

if (ASFPassword === '') {
  logger.warn('You have not set an ASF password. It is highly recommended to do so for security reasons.');
}

const mode = configuration('devMode');
const guilds = configuration('guilds');

if (mode && guilds.length === 0) {
  logger.warn('You are running the bot in development mode but haven\'t set any guilds. Slash commands won\'t be registered.');
}

logger.info(`Bot running in ${mode ? 'development' : 'production'} mode`);

await getCommands();
await registerCommands();

try {
  await client.login(token);

  logger.info('Bot logged in');
} catch (error) {
  logger.error(`Bot failed to log in: ${error}`);
}

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  logger.debug(`Received chat input interaction ${interaction.id}`);

  const command = commands.get(interaction.commandName);

  if (command === undefined) {
    logger.error(`No command found for ${interaction.commandName}`);

    return;
  }

  if (interaction.channel?.type === ChannelType.GuildText) {
    logger.info(`${interaction.user.tag}: ${interaction} (ID: ${interaction.id}) [Guild: ${interaction.guild?.id} - ${interaction.guild?.name}]`);
  } else if (interaction.channel?.type === ChannelType.DM) {
    logger.info(`${interaction.user.tag}: ${interaction} (ID: ${interaction.id}) [DM]`);
  } else if (interaction.channel?.type === ChannelType.GuildPublicThread || interaction.channel?.type === ChannelType.GuildPrivateThread) {
    logger.info(`${interaction.user.tag}: ${interaction} (ID: ${interaction.id}) [Thread]`);
  }

  try {
    logger.debug(`Deferring and executing interaction ${interaction.id}`);

    await interaction.deferReply();
    await command.execute(interaction);

    logger.debug(`Executed chat input interaction ${interaction.id}`);
  } catch (error) {
    await longReplyToInteraction(interaction, getString('error'));

    logger.error(`Failed to handle chat input interaction ${interaction}: ${error}`);
  }
});

client.once('ready', async () => {
  logger.info('Servers:');
  for (const [index, guild] of client.guilds.cache.map((server) => `${server.id} - ${server.name}`).entries()) {
    logger.info(`${index + 1}.\t${guild}`);
  }

  logger.info('Bot is ready');

  initWS();
  sendLog().catch((error) => logger.error(`This error should never have happened (WS)\n${error}`));

  await initDB();
  await loadTables();
  loadReminders().catch((error) => logger.error(`This error should never have happened (DB)\n${error}`));
});
