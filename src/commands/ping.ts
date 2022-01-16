import {SlashCommandBuilder} from '@discordjs/builders';
import type {CommandInteraction} from 'discord.js';
import {ping} from '../main';
import {replyToInteraction} from '../utils/printing';
import {descriptions} from '../utils/strings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription(descriptions.ping),

  async execute (interaction: CommandInteraction) {
    await replyToInteraction(interaction, `${ping()} ms`);
  }
};
