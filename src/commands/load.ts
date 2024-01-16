import { configuration, reloadConfig } from '../utils/config.js';
import { shortReplyToInteraction } from '../utils/printing.js';
import { getDescription, getString } from '../utils/strings.js';
import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

const commandName = 'load';

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName));

export const execute = async (interaction: ChatInputCommandInteraction) => {
  if (!configuration('admins').includes(interaction.user.id)) {
    await shortReplyToInteraction(
      interaction,
      getString('noCommandPermission'),
    );
    return;
  }

  await reloadConfig();
  await shortReplyToInteraction(interaction, 'Settings have been reloaded.');
};
