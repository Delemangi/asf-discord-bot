import {SlashCommandBuilder} from '@discordjs/builders';
import {type CommandInteraction} from 'discord.js';
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

export async function execute (interaction: CommandInteraction) {
  const accounts: string = interaction.options.getString('accounts') ?? '';
  const settings: string = interaction.options.getString('settings') ?? '';
  const message: string = await sendPrivilegedASFRequest(interaction, commandName, `${accounts} ${settings}`, 2);

  await longReplyToInteraction(interaction, message);
}
