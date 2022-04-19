import {SlashCommandBuilder} from '@discordjs/builders';
import type {CommandInteraction} from 'discord.js';
import {ASFRequest} from '../utils/asf';
import {longReplyToInteraction} from '../utils/printing';
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
    const game: string = interaction.options.getString('game') ?? '';
    const output: string = await ASFRequest(interaction, 'oa', game);
    const message: string[] = output.split('\n').filter((line) => cases.every((value) => !line.includes(value)) && line.includes('|') && line.length > 1);

    if (message.length > 0) {
      message.push(`<ASF> ${message.length} account(s) own the queried game(s).`);
    } else {
      message.push('<ASF> No accounts own the queried game(s).');
    }

    await longReplyToInteraction(interaction, message.join('\n'));
  }
};
