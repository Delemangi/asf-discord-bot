import {SlashCommandBuilder} from '@discordjs/builders';
import type {CommandInteraction} from 'discord.js';
import {ASFRequest} from '../utils/asf';
import {replyToInteraction} from '../utils/printing';
import {descriptions} from '../utils/strings';

const cases: string[] = [
  'Not owned yet',
  'gamesOwned is empty',
  'This bot instance is not connected!',
  'bots already own game'
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('oa')
    .setDescription(descriptions.oa)
    .addStringOption((option) => option
      .setName('game')
      .setDescription('Game')
      .setRequired(true)),

  async execute (interaction: CommandInteraction) {
    const output: string = await ASFRequest(interaction, 'oa', `${interaction.options.getString('game')}`);
    const split: string[] = output.split('\n');
    const buffer: string[] = [];

    for (const line of split) {
      if (cases.every((value) => !line.includes(value)) && line.length > 2) {
        buffer.push(line);
      }
    }

    if (buffer.length) {
      buffer.push(`<ASF> ${buffer.length} account(s) own the queried game.`);
      await replyToInteraction(interaction, buffer.join('\n'));
    } else {
      await replyToInteraction(interaction, '<ASF> No accounts own the queried game.');
    }
  }
};
