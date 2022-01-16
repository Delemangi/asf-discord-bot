import {SlashCommandBuilder} from '@discordjs/builders';
import type {CommandInteraction} from 'discord.js';
import {config} from '../config';
import {replyToInteraction} from '../utils/printing';
import {descriptions} from '../utils/strings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('permissions')
    .setDescription(descriptions.permissions),

  async execute (interaction: CommandInteraction) {
    let output: string;

    if (interaction.user.id in config.asfPermissions) {
      output = config.asfPermissions[interaction.user.id].join(', ');
    } else {
      output = 'None';
    }

    await replyToInteraction(interaction, output);
  }
};
