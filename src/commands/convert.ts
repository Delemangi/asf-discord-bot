import {SlashCommandBuilder} from '@discordjs/builders';
import {type CommandInteraction} from 'discord.js';
import {convertCurrencies} from '../utils/currency.js';
import {longReplyToInteraction} from '../utils/printing.js';
import {getDescription} from '../utils/strings.js';

const commandName = 'convert';

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName))
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
    .setRequired(false));

export async function execute (interaction: CommandInteraction) {
  const amount: number = interaction.options.getNumber('amount') ?? 0;
  const from: string = interaction.options.getString('from') ?? '';
  const to: string = interaction.options.getString('to') ?? 'EUR';
  const digits: number = interaction.options.getInteger('digits') ?? 2;
  const message: string = await convertCurrencies(amount, from, to, digits);

  await longReplyToInteraction(interaction, message);
}
