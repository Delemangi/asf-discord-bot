import {SlashCommandBuilder} from '@discordjs/builders';
import type {CommandInteraction} from 'discord.js';
import {privilegedASFRequest} from '../utils/asf';
import {longReplyToInteraction} from '../utils/printing';
import {descriptions} from '../utils/strings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sa')
    .setDescription(descriptions.sa),

  async execute (interaction: CommandInteraction) {
    const message: string = await privilegedASFRequest(interaction, 'sa', '');

    await longReplyToInteraction(interaction, message);
  }
};
