import type { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { replyToInteraction } from '../utils/printing'
import { config } from '../config'
import { descriptions } from '../utils/strings'

module.exports = {
  'data': new SlashCommandBuilder()
    .setName('permissions')
    .setDescription(descriptions.permissions),

  async execute (interaction: CommandInteraction) {
    let output: string

    if (interaction.user.id in config.asfPermissions) {
      output = config.asfPermissions[interaction.user.id].join(', ')
    } else {
      output = 'None'
    }

    await replyToInteraction(interaction, output)
  }
}
