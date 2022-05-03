import {SlashCommandBuilder} from '@discordjs/builders';
import {type CommandInteraction} from 'discord.js';
import {sendPrivilegedASFRequest} from '../utils/asf.js';
import {longReplyToInteraction} from '../utils/printing.js';
import {getDescription} from '../utils/strings.js';

const commandName = 'transfer';

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName))
  .addStringOption((option) => option
    .setName('accounts')
    .setDescription('Accounts')
    .setRequired(true))
  .addIntegerOption((option) => option
    .setName('app')
    .setDescription('App')
    .setRequired(true))
  .addIntegerOption((option) => option
    .setName('context')
    .setDescription('Context')
    .setRequired(true))
  .addIntegerOption((option) => option
    .setName('target')
    .setDescription('Target')
    .setRequired(true));

export async function execute (interaction: CommandInteraction) {
  const accounts: string = interaction.options.getString('accounts') ?? '';
  const app: number = interaction.options.getInteger('app') ?? 0;
  const context: number = interaction.options.getInteger('context') ?? 0;
  const target: number = interaction.options.getInteger('target') ?? 0;
  const message: string = await sendPrivilegedASFRequest(interaction, 'transfer^', `${accounts} ${app} ${context} ${target}`, 4);

  await longReplyToInteraction(interaction, message);
}
