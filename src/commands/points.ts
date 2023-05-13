import { sendPrivilegedASFRequest } from '../utils/asf.js';
import { longReplyToInteraction } from '../utils/printing.js';
import { getDescription } from '../utils/strings.js';
import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

const commandName = 'points';

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName))
  .addStringOption((option) =>
    option.setName('accounts').setDescription('Accounts').setRequired(true),
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const accounts = interaction.options.getString('accounts', true);
  const message = await sendPrivilegedASFRequest(
    interaction,
    commandName,
    accounts,
  );

  await longReplyToInteraction(interaction, message);
};
