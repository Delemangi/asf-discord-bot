import {SlashCommandBuilder} from '@discordjs/builders';
import type {CommandInteraction} from 'discord.js';
import {ASFThenMail} from '../utils/asf';
import {longReplyToInteraction} from '../utils/printing';
import {descriptions} from '../utils/strings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('2faok')
    .setDescription(descriptions['2faok'])
    .addStringOption((option) => option
      .setName('accounts')
      .setDescription('Accounts')
      .setRequired(true)),

  async execute (interaction: CommandInteraction) {
    const accounts: string = interaction.options.getString('accounts') ?? '';
    const message: string = await ASFThenMail(interaction, '2faok', accounts);

    await longReplyToInteraction(interaction, message);
  }
};
