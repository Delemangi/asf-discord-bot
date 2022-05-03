import {SlashCommandBuilder} from '@discordjs/builders';
import {type CommandInteraction} from 'discord.js';
import {sendASFOrMailRequest} from '../utils/asf.js';
import {longReplyToInteraction} from '../utils/printing.js';
import {getDescription} from '../utils/strings.js';

const commandName = '2faok';

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName))
  .addStringOption((option) => option
    .setName('accounts')
    .setDescription('Accounts')
    .setRequired(true));

export async function execute (interaction: CommandInteraction) {
  const accounts: string = interaction.options.getString('accounts') ?? '';
  const message: string = await sendASFOrMailRequest(interaction, commandName, accounts);

  await longReplyToInteraction(interaction, message);
}
