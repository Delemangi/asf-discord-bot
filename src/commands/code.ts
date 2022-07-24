import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction
} from 'discord.js';
import {generateCode} from '../utils/code.js';
import {normalReplyToInteraction} from '../utils/printing.js';
import {getDescription} from '../utils/strings.js';

const commandName = 'code';

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName));

export async function execute (interaction: ChatInputCommandInteraction): Promise<void> {
  const message = generateCode().toString();

  await normalReplyToInteraction(interaction, message);
}
