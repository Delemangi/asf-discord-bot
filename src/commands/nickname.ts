import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import { sendPrivilegedASFRequest } from '../utils/asf.js';
import { longReplyToInteraction } from '../utils/printing.js';
import { getDescription } from '../utils/strings.js';

const commandName = 'nickname';

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName))
  .addStringOption((option) =>
    option.setName('accounts').setDescription('Accounts').setRequired(true),
  )
  .addStringOption((option) =>
    option.setName('nickname').setDescription('Nickname').setRequired(true),
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const accounts = interaction.options.getString('accounts') ?? '';
  const nickname = interaction.options.getString('nickname') ?? '';
  const message = await sendPrivilegedASFRequest(
    interaction,
    commandName,
    `${accounts} ${nickname}`,
    32,
  );

  await longReplyToInteraction(interaction, message);
};
