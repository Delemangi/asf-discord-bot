import {SlashCommandBuilder} from '@discordjs/builders';
import {type CommandInteraction} from 'discord.js';
import {normalReplyToInteraction} from '../utils/printing.js';
import {saveReminder} from '../utils/reminder.js';
import {getDescription} from '../utils/strings.js';

const commandName = 'reminder';

export const data = new SlashCommandBuilder()
  .setName(commandName)
  .setDescription(getDescription(commandName))
  .addStringOption((option) => option
    .setName('time')
    .setDescription('Time')
    .setRequired(true))
  .addStringOption((option) => option
    .setName('reminder')
    .setDescription('Reminder')
    .setRequired(false));

export async function execute (interaction: CommandInteraction) {
  const time: string = interaction.options.getString('time') ?? '';
  const reminder: string = interaction.options.getString('reminder') ?? 'Reminder';
  const author: string = interaction.user.id;
  const channel: string = interaction.channel?.id ?? '';
  const message: string = await saveReminder(time, reminder, author, channel);

  await normalReplyToInteraction(interaction, message);
}
