import {SlashCommandBuilder} from '@discordjs/builders';
import {type CommandInteraction} from 'discord.js';
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

export async function execute (interaction: CommandInteraction) {
  const args: string[] = interaction.options.getString('command')?.split(' ') ?? [];
  const command: string = args.shift() ?? '';
  const message: string = await doASFCommand(interaction, command, args);

  await longReplyToInteraction(interaction, message);
}
