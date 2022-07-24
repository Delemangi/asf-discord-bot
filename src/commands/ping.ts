import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder
} from 'discord.js';
import {ping} from '../utils/client.js';
import {normalReplyToInteraction} from '../utils/printing.js';
import {getDescription} from '../utils/strings.js';

const commandName = 'ping';

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName));

export async function execute (interaction: ChatInputCommandInteraction): Promise<void> {
  const message = `${ping()} ms`;

  await normalReplyToInteraction(interaction, message);
}
