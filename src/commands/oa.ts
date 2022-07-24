import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder
} from 'discord.js';
import {sendASFRequest} from '../utils/asf.js';
import {longReplyToInteraction} from '../utils/printing.js';
import {getDescription} from '../utils/strings.js';

const commandName = 'oa';
const cases: string[] = [
  'Not owned yet',
  'gamesOwned is empty',
  'This bot instance is not connected!',
  'bots already own game'
];

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName))
  .addStringOption((option) => option
    .setName('game')
    .setDescription('Game')
    .setRequired(true));

export async function execute (interaction: ChatInputCommandInteraction): Promise<void> {
  const game = interaction.options.getString('game') ?? '';
  const output = await sendASFRequest(interaction, commandName, game);
  const message = output.split('\n').filter((line) => cases.every((value) => !line.includes(value)) && line.includes('|') && line.length > 1);

  if (message.length > 0) {
    message.push(`<ASF> Found ${message.length} matches.`);
  } else {
    message.push('<ASF> Found no matches.');
  }

  await longReplyToInteraction(interaction, message.join('\n'));
}
