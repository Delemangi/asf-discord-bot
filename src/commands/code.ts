import {SlashCommandBuilder} from '@discordjs/builders';
import type {CommandInteraction} from 'discord.js';
import {generateCode} from '../utils/code';
import {longReplyToInteraction} from '../utils/printing';
import {descriptions} from '../utils/strings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('code')
    .setDescription(descriptions.code),

  async execute (interaction: CommandInteraction) {
    const message: string = generateCode().toString();

    await longReplyToInteraction(interaction, message);
  }
};
