import {SlashCommandBuilder} from '@discordjs/builders';
import {type CommandInteraction} from 'discord.js';
import {reloadConfig} from '../utils/config.js';
import {permissionCheck} from '../utils/permissions.js';
import {shortReplyToInteraction} from '../utils/printing.js';
import {
  getDescription,
  getString
} from '../utils/strings.js';

const commandName = 'load';

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName));

export async function execute (interaction: CommandInteraction) {
  if (!permissionCheck(interaction.user.id, 'load')) {
    await shortReplyToInteraction(interaction, getString('noCommandPermission'));
    return;
  }

  await reloadConfig();
  await shortReplyToInteraction(interaction, 'Settings have been reloaded.');
}
