import { executeASFCommand } from '../utils/asf.js';
import { configuration } from '../utils/config.js';
import {
  longReplyToInteraction,
  shortReplyToInteraction,
} from '../utils/printing.js';
import { getDescription, getString } from '../utils/strings.js';
import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

const commandName = 'asf';

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName))
  .addStringOption((option) =>
    option.setName('command').setDescription('Command').setRequired(true),
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  if (!configuration('admins').includes(interaction.user.id)) {
    await shortReplyToInteraction(
      interaction,
      getString('noCommandPermission'),
    );
    return;
  }

  const args = interaction.options.getString('command', true).split(' ') ?? [];
  const command = args.shift() ?? '';
  const message = await executeASFCommand(interaction, command, args);

  await longReplyToInteraction(interaction, message);
};
