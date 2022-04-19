import {SlashCommandBuilder} from '@discordjs/builders';
import type {
  CommandInteraction,
  User
} from 'discord.js';
import {rolesCommand} from '../utils/permissions';
import {longReplyToInteraction} from '../utils/printing';
import {descriptions} from '../utils/strings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roles')
    .setDescription(descriptions.roles)
    .addUserOption((option) => option
      .setName('user')
      .setDescription('User')
      .setRequired(false)),

  async execute (interaction: CommandInteraction) {
    const user: User = interaction.options.getUser('user') ?? interaction.user;
    const message: string = rolesCommand(user);

    await longReplyToInteraction(interaction, message);
  }
};
