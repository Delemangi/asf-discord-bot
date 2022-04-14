import {SlashCommandBuilder} from '@discordjs/builders';
import type {CommandInteraction} from 'discord.js';
import {configuration} from '../utils/config';
import {replyToInteraction} from '../utils/printing';
import {descriptions} from '../utils/strings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('permissions')
    .setDescription(descriptions.permissions)
    .addStringOption((option) => option
      .setName('user')
      .setDescription('User')
      .setRequired(false)),

  async execute (interaction: CommandInteraction) {
    let output: string = 'None';
    const permissions: {[index: string]: string[]} = configuration('asfPermissions');
    const user: string = interaction.options.getString('user') ?? interaction.user.id;

    if (user in permissions) {
      const userPermissions: string | string[] = permissions[user];

      if (Array.isArray(userPermissions)) {
        output = userPermissions.join(', ');
      } else {
        output = userPermissions;
      }
    }

    await replyToInteraction(interaction, output);
  }
};
