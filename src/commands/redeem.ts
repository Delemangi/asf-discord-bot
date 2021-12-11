import type { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { replyToInteraction } from '../utils/printing'
import { privilegedASFRequest } from '../utils/asf'
import { descriptions } from '../utils/strings'

module.exports = {
  'data': new SlashCommandBuilder()
    .setName('redeem')
    .setDescription(descriptions.redeem)
    .addStringOption((option) => option
      .setName('accounts')
      .setDescription('Accounts')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('keys')
      .setDescription('Keys')
      .setRequired(true)),

  async execute (interaction: CommandInteraction) {
    const output: string = await privilegedASFRequest(interaction, 'redeem', `${interaction.options.getString('accounts')} ${interaction.options.getString('keys')}`, 2)

    await replyToInteraction(interaction, output)
  }
}
