import {SlashCommandBuilder} from '@discordjs/builders';
import type {CommandInteraction} from 'discord.js';
import {getCode} from '../utils/code';
import {replyToInteraction} from '../utils/printing';
import {descriptions} from '../utils/strings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('code')
    .setDescription(descriptions.code),

  async execute (interaction: CommandInteraction) {
    const output: string = getCode(interaction);

    await replyToInteraction(interaction, output);
  }
};
