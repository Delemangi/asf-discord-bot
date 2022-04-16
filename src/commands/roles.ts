import {SlashCommandBuilder} from '@discordjs/builders';
import type {
  CommandInteraction,
  User
} from 'discord.js';
import {configuration} from '../utils/config';
import {replyToInteraction} from '../utils/printing';
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
    let output: string = 'None';
    const permissions: {[index: string]: string[]} = configuration('permissions');
    const user: User = interaction.options.getUser('user') ?? interaction.user;

    if (user.id in permissions) {
      const userPermissions: string[] = permissions[user.id];

      if (userPermissions.length > 0) {
        output = userPermissions.join(', ');
      }
    }

    await replyToInteraction(interaction, output);
  }
};
