import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder
} from 'discord.js';
import {doASFCommand} from '../utils/asf.js';
import {longReplyToInteraction} from '../utils/printing.js';
import {getDescription} from '../utils/strings.js';

const commandName = 'asf';

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName))
  .addStringOption((option) => option
    .setName('command')
    .setDescription('Command')
    .setRequired(true));

export async function execute (interaction: ChatInputCommandInteraction): Promise<void> {
  const args = interaction.options.getString('command')?.split(' ') ?? [];
  const command = args.shift() ?? '';
  const message = await doASFCommand(interaction, command, args);

  await longReplyToInteraction(interaction, message);
}
