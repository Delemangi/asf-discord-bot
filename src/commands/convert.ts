import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder
} from 'discord.js';
import {convertCurrencies} from '../utils/currency.js';
import {shortReplyToInteraction} from '../utils/printing.js';
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

export async function execute (interaction: ChatInputCommandInteraction): Promise<void> {
  const amount = interaction.options.getNumber('amount') ?? 0;
  const from = interaction.options.getString('from') ?? '';
  const to = interaction.options.getString('to') ?? 'EUR';
  const digits = interaction.options.getInteger('digits') ?? 2;
  const message = await convertCurrencies(interaction, amount, from, to, digits);

  await shortReplyToInteraction(interaction, message);
}
