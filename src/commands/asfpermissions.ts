import {SlashCommandBuilder} from '@discordjs/builders';
import {
  type CommandInteraction,
  type User
} from 'discord.js';
import {permissionsASFCommand} from '../utils/asf.js';
import {longReplyToInteraction} from '../utils/printing.js';
import {getDescription} from '../utils/strings.js';

const commandName = 'asfpermissions';

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName))
  .addUserOption((option) => option
    .setName('user')
    .setDescription('User')
    .setRequired(false));

export async function execute (interaction: CommandInteraction) {
  const user: User = interaction.options.getUser('user') ?? interaction.user;
  const message: string = permissionsASFCommand(user);

  await longReplyToInteraction(interaction, message);
}
