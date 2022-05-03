import {SlashCommandBuilder} from '@discordjs/builders';
import {type CommandInteraction} from 'discord.js';
import {sendPrivilegedASFRequest} from '../utils/asf.js';
import {longReplyToInteraction} from '../utils/printing.js';
import {getDescription} from '../utils/strings.js';

const commandName = 'redeem';

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName))
  .addStringOption((option) => option
    .setName('accounts')
    .setDescription('Accounts')
    .setRequired(true))
  .addStringOption((option) => option
    .setName('keys')
    .setDescription('Keys')
    .setRequired(true));

export async function execute (interaction: CommandInteraction) {
  const accounts: string = interaction.options.getString('accounts') ?? '';
  const keys: string = interaction.options.getString('keys') ?? '';
  const message: string = await sendPrivilegedASFRequest(interaction, commandName, `${accounts} ${keys}`, 2);

  await longReplyToInteraction(interaction, message);
}
