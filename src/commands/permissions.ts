import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';

import { permissionsCommand } from '../utils/asf.js';
import { longReplyToInteraction } from '../utils/printing.js';
import { getDescription } from '../utils/strings.js';

const commandName = 'permissions';

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName))
  .addUserOption((option) =>
    option.setName('user').setDescription('User').setRequired(false),
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const user = interaction.options.getUser('user') ?? interaction.user;
  const message = permissionsCommand(user);

  await longReplyToInteraction(interaction, message);
};
