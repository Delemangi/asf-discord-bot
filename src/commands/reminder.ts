import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder
} from 'discord.js';
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

export async function execute (interaction: ChatInputCommandInteraction): Promise<void> {
  const time = interaction.options.getString('time') ?? '';
  const reminder = interaction.options.getString('reminder') ?? '-';
  const author = interaction.user.id;
  const channel = interaction.channel?.id ?? '';
  const message = await saveReminder(time, reminder, author, channel);

  await normalReplyToInteraction(interaction, message);
}
