import {SlashCommandBuilder} from '@discordjs/builders';
import type {CommandInteraction} from 'discord.js';
import {privilegedASFRequest} from '../utils/asf';
import {replyToInteraction} from '../utils/printing';
import {descriptions} from '../utils/strings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nickname')
    .setDescription(descriptions.nickname)
    .addStringOption((option) => option
      .setName('accounts')
      .setDescription('Accounts')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('nickname')
      .setDescription('Nickname')
      .setRequired(true)),

  async execute (interaction: CommandInteraction) {
    const output: string = await privilegedASFRequest(interaction, 'nickname', `${interaction.options.getString('accounts')} ${interaction.options.getString('nickname')}`, 32);

    await replyToInteraction(interaction, output);
  }
};
