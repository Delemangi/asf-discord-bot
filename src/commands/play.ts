import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import { sendPrivilegedASFRequest } from '../utils/asf.js';
import { longReplyToInteraction } from '../utils/printing.js';
import { getDescription } from '../utils/strings.js';

const commandName = 'play';

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName))
  .addStringOption((option) =>
    option.setName('accounts').setDescription('Accounts').setRequired(true),
  )
  .addStringOption((option) =>
    option.setName('apps').setDescription('Apps').setRequired(true),
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const accounts = interaction.options.getString('accounts', true);
  const apps = interaction.options.getString('apps', true);
  const message = await sendPrivilegedASFRequest(
    interaction,
    commandName,
    `${accounts} ${apps}`,
    2,
  );

  await longReplyToInteraction(interaction, message);
};
