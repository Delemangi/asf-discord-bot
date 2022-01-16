import {SlashCommandBuilder} from '@discordjs/builders';
import type {CommandInteraction} from 'discord.js';
import {privilegedASFRequest} from '../utils/asf';
import {replyToInteraction} from '../utils/printing';
import {descriptions} from '../utils/strings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sa')
    .setDescription(descriptions.sa),

  async execute (interaction: CommandInteraction) {
    const output: string = await privilegedASFRequest(interaction, 'sa', '');

    await replyToInteraction(interaction, output);
  }
};
