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
import {validate} from './utils/validation.js';
import {
  initWS,
  sendLog
} from './utils/ws.js';

logger.info(`Bot running in ${configuration('devMode') ? 'development' : 'production'} mode`);

validate();
await getCommands();
await registerCommands();

try {
  await client.login(configuration('token'));

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

  logger.debug(`Deferring and executing interaction ${interaction.id}`);

  try {
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
