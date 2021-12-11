import type { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { saveReminder } from '../utils/reminder'
import { descriptions } from '../utils/strings'

module.exports = {
  'data': new SlashCommandBuilder()
    .setName('reminder')
    .setDescription(descriptions.reminder)
    .addStringOption((option) => option
      .setName('time')
      .setDescription('Time')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('message')
      .setDescription('Message')
      .setRequired(false)),

  async execute (interaction: CommandInteraction) {
    saveReminder(interaction)
  }
}
