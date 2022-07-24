import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder
} from 'discord.js';
import {sendPrivilegedASFRequest} from '../utils/asf.js';
import {longReplyToInteraction} from '../utils/printing.js';
import {getDescription} from '../utils/strings.js';

const commandName = 'sa';

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName));

export async function execute (interaction: ChatInputCommandInteraction): Promise<void> {
  const message = await sendPrivilegedASFRequest(interaction, commandName, '');

  await longReplyToInteraction(interaction, message);
}
