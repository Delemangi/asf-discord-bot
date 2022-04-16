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
    .setName('permissions')
    .setDescription(descriptions.permissions)
    .addUserOption((option) => option
      .setName('user')
      .setDescription('User')
      .setRequired(false)),

  async execute (interaction: CommandInteraction) {
    const output: Set<string> = new Set();
    const permissions: {[index: string]: string[]} = configuration('permissions');
    const roles: {[index: string]: string[]} = configuration('roles');
    const user: User = interaction.options.getUser('user') ?? interaction.user;

    if (user.id in permissions) {
      const userRoles: string[] = permissions[user.id];

      if (userRoles.includes('All')) {
        await replyToInteraction(interaction, 'All');
        return;
      }

      for (const role of userRoles) {
        const rolePermissions: string[] = roles[role] ?? [];

        for (const permission of rolePermissions) {
          output.add(permission);
        }
      }
    }

    if (output.size > 0) {
      await replyToInteraction(interaction, [...output].join(', '));
    } else {
      await replyToInteraction(interaction, 'None');
    }
  }
};
