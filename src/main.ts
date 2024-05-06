import { client } from './utils/client.js';
import { getCommand } from './utils/commands.js';
import { configuration } from './utils/config.js';
import { logger } from './utils/logger.js';
import { longReplyToInteraction } from './utils/printing.js';
import { getString } from './utils/strings.js';
import { validate } from './utils/validation.js';
import { initializeWS, sendASFLogs } from './utils/ws.js';

validate();

try {
  await client.login(configuration('token'));

  logger.info('Bot logged in');
} catch (error) {
  logger.error(`Bot failed to log in: ${error}`);
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const command = await getCommand(interaction.commandName);

  if (command === undefined) {
    logger.error(`No command found for ${interaction.commandName}`);
    return;
  }

  if (interaction.channel?.isDMBased()) {
    logger.info(`${interaction.user.tag}: ${interaction} [DM]`);
  } else {
    logger.info(
      `${interaction.user.tag}: ${interaction} [${interaction.guild?.name}]`,
    );
  }

  try {
    await interaction.deferReply();
    await command.execute(interaction);
  } catch (error) {
    await longReplyToInteraction(interaction, getString('error'));

    logger.error(
      `Failed to handle chat input interaction ${interaction}: ${error}`,
    );
  }
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
client.once('ready', async () => {
  initializeWS();
  void sendASFLogs();

  logger.info('Bot is ready');
});
