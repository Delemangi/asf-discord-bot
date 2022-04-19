import {SlashCommandBuilder} from '@discordjs/builders';
import type {
  CommandInteraction,
  User
} from 'discord.js';
import {permissionsCommand} from '../utils/permissions';
import {shortReplyToInteraction} from '../utils/printing';
import {descriptions} from '../utils/strings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('permissions')
    .setDescription(descriptions.permissions)
    .addUserOption((option) => option
      .setName('user')
      .setDescription('User')
      .setRequired(false)),

  async execute (interaction: CommandInteraction) {
    const user: User = interaction.options.getUser('user') ?? interaction.user;
    const message: string = permissionsCommand(user);

    await shortReplyToInteraction(interaction, message);
  }
};
