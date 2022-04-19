import {SlashCommandBuilder} from '@discordjs/builders';
import type {CommandInteraction} from 'discord.js';
import {reloadConfig} from '../utils/config';
import {permissionCheck} from '../utils/permissions';
import {shortReplyToInteraction} from '../utils/printing';
import {
  descriptions,
  strings
} from '../utils/strings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('load')
    .setDescription(descriptions.load),

  async execute (interaction: CommandInteraction) {
    if (!permissionCheck(interaction.user.id, 'load')) {
      await shortReplyToInteraction(interaction, strings.noCommandPermission);
      return;
    }

    await reloadConfig();
    await shortReplyToInteraction(interaction, 'Settings have been reloaded.');
  }
};
