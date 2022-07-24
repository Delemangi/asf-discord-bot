import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder
} from 'discord.js';
import {sendPrivilegedASFRequest} from '../utils/asf.js';
import {longReplyToInteraction} from '../utils/printing.js';
import {getDescription} from '../utils/strings.js';

const commandName = 'level';

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName))
  .addStringOption((option) => option
    .setName('accounts')
    .setDescription('Accounts')
    .setRequired(true));

export async function execute (interaction: ChatInputCommandInteraction): Promise<void> {
  const accounts = interaction.options.getString('accounts') ?? '';
  const message = await sendPrivilegedASFRequest(interaction, commandName, accounts);

  await longReplyToInteraction(interaction, message);
}
