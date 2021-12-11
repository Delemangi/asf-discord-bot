import type { CommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { replyToInteraction } from '../utils/printing'
import { privilegedASFRequest } from '../utils/asf'
import { descriptions } from '../utils/strings'

module.exports = {
  'data': new SlashCommandBuilder()
    .setName('addlicense')
    .setDescription(descriptions.addlicense)
    .addStringOption((option) => option
      .setName('accounts')
      .setDescription('Accounts')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('apps')
      .setDescription('Apps')
      .setRequired(true)),

  async execute (interaction: CommandInteraction) {
    const output: string = await privilegedASFRequest(interaction, 'addlicense', `${interaction.options.getString('accounts')} ${interaction.options.getString('apps')}`, 2)
    const split: string[] = output.split('\n')
    split = split.filter(i => i.length > 2)

    await replyToInteraction(interaction, split.join('\n'))
  }
}
