import {SlashCommandBuilder} from '@discordjs/builders';
import type {CommandInteraction} from 'discord.js';
import {ping} from '../main';
import {longReplyToInteraction} from '../utils/printing';
import {descriptions} from '../utils/strings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(descriptions.ping),

  async execute (interaction: CommandInteraction) {
    const message: string = `${ping()} ms`;

    await longReplyToInteraction(interaction, message);
  }
};
