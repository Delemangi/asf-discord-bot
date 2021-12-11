import type { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { replyToInteraction } from '../utils/printing'
import { descriptions } from '../utils/strings'
import { ping } from '../main'

module.exports = {
  'data': new SlashCommandBuilder()
    .setName('ping')
    .setDescription(descriptions.ping),

  async execute (interaction: CommandInteraction) {
    await replyToInteraction(interaction, `${ping()} ms`)
  }
}
