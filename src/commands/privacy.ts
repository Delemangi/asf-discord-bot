import {SlashCommandBuilder} from '@discordjs/builders';
import type {CommandInteraction} from 'discord.js';
import {privilegedASFRequest} from '../utils/asf';
import {longReplyToInteraction} from '../utils/printing';
import {descriptions} from '../utils/strings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('privacy')
    .setDescription(descriptions.privacy)
    .addStringOption((option) => option
      .setName('accounts')
      .setDescription('Accounts')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('settings')
      .setDescription('Privacy settings')
      .setRequired(true)),

  async execute (interaction: CommandInteraction) {
    const accounts: string = interaction.options.getString('accounts') ?? '';
    const settings: string = interaction.options.getString('settings') ?? '';
    const message: string = await privilegedASFRequest(interaction, 'privacy', `${accounts} ${settings}`, 2);

    await longReplyToInteraction(interaction, message);
  }
};
