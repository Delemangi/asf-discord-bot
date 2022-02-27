import {SlashCommandBuilder} from '@discordjs/builders';
import type {CommandInteraction} from 'discord.js';
import {convertCurrencies} from '../utils/currency';
import {replyToInteraction} from '../utils/printing';
import {descriptions} from '../utils/strings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('convert')
    .setDescription(descriptions.convert)
    .addNumberOption((option) => option
      .setName('amount')
      .setDescription('Amount')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('from')
      .setDescription('From')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('to')
      .setDescription('To (EUR)')
      .setRequired(false))
    .addIntegerOption((option) => option
      .setName('digits')
      .setDescription('Digits (2)')
      .setRequired(false)),

  async execute (interaction: CommandInteraction) {
    await interaction.deferReply();
    const output: string = await convertCurrencies(interaction.options.getNumber('amount') ?? 0, `${interaction.options.getString('from')}`, interaction.options.getString('to') ?? 'EUR', interaction.options.getInteger('digits') ?? 2);

    await replyToInteraction(interaction, output);
  }
};
