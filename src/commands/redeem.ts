import {SlashCommandBuilder} from '@discordjs/builders';
import type {CommandInteraction} from 'discord.js';
import {privilegedASFRequest} from '../utils/asf';
import {longReplyToInteraction} from '../utils/printing';
import {descriptions} from '../utils/strings';

module.exports = {
  data: new SlashCommandBuilder()
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
    const accounts: string = interaction.options.getString('accounts') ?? '';
    const keys: string = interaction.options.getString('keys') ?? '';
    const message: string = await privilegedASFRequest(interaction, 'redeem', `${accounts} ${keys}`, 2);

    await longReplyToInteraction(interaction, message);
  }
};
