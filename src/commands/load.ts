import {SlashCommandBuilder} from '@discordjs/builders';
import type {CommandInteraction} from 'discord.js';
import {reloadConfig} from '../utils/config';
import {replyToInteraction} from '../utils/printing';
import {descriptions} from '../utils/strings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('load')
    .setDescription(descriptions.load),

  async execute (interaction: CommandInteraction) {
    await reloadConfig();
    await replyToInteraction(interaction, 'Reloaded settings.');
  }
};
