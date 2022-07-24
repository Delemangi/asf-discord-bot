import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder
} from 'discord.js';
import {sendPrivilegedASFRequest} from '../utils/asf.js';
import {longReplyToInteraction} from '../utils/printing.js';
import {getDescription} from '../utils/strings.js';

const commandName = 'addlicense';

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName))
  .addStringOption((option) => option
    .setName('accounts')
    .setDescription('Accounts')
    .setRequired(true))
  .addStringOption((option) => option
    .setName('apps')
    .setDescription('Apps')
    .setRequired(true));

export async function execute (interaction: ChatInputCommandInteraction): Promise<void> {
  const accounts = interaction.options.getString('accounts') ?? '';
  const apps = interaction.options.getString('apps') ?? '';
  const output = await sendPrivilegedASFRequest(interaction, commandName, `${accounts} ${apps}`, 2);
  const message = output.split('\n').filter((line) => line.length > 2).join('\n');

  await longReplyToInteraction(interaction, message);
}
