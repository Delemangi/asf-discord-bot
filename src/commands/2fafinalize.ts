import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import { sendPrivilegedASFRequest } from '../utils/asf.js';
import { longReplyToInteraction } from '../utils/printing.js';
import { getDescription } from '../utils/strings.js';

const commandName = '2fafinalize';

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName))
  .addStringOption((option) =>
    option.setName('account').setDescription('Account').setRequired(true),
  )
  .addStringOption((option) =>
    option.setName('code').setDescription('2FA Code').setRequired(true),
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const account = interaction.options.getString('account', true);
  const code = interaction.options.getString('code', true);
  const message = await sendPrivilegedASFRequest(
    interaction,
    commandName,
    `${account} ${code}`,
    1,
  );

  await longReplyToInteraction(interaction, message);
};
