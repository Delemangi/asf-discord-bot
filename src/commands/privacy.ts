import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder
} from 'discord.js';
import {sendPrivilegedASFRequest} from '../utils/asf.js';
import {longReplyToInteraction} from '../utils/printing.js';
import {getDescription} from '../utils/strings.js';

const commandName = 'privacy';

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName))
  .addStringOption((option) => option
    .setName('accounts')
    .setDescription('Accounts')
    .setRequired(true))
  .addStringOption((option) => option
    .setName('settings')
    .setDescription('Privacy settings')
    .setRequired(true));

export async function execute (interaction: ChatInputCommandInteraction): Promise<void> {
  const accounts = interaction.options.getString('accounts') ?? '';
  const settings = interaction.options.getString('settings') ?? '';
  const message = await sendPrivilegedASFRequest(interaction, commandName, `${accounts} ${settings}`, 2);

  await longReplyToInteraction(interaction, message);
}
