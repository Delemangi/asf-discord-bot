import {SlashCommandBuilder} from '@discordjs/builders';
import {type CommandInteraction} from 'discord.js';
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

export async function execute (interaction: CommandInteraction) {
  const game: string = interaction.options.getString('game') ?? '';
  const output: string = await sendASFRequest(interaction, commandName, game);
  const message: string[] = output.split('\n').filter((line) => cases.every((value) => !line.includes(value)) && line.includes('|') && line.length > 1);

  if (message.length > 0) {
    message.push(`<ASF> ${message.length} account(s) own the queried game(s).`);
  } else {
    message.push('<ASF> No accounts own the queried game(s).');
  }

  await longReplyToInteraction(interaction, message.join('\n'));
}
