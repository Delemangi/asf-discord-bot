import {SlashCommandBuilder} from '@discordjs/builders';
import type {CommandInteraction} from 'discord.js';
import {privilegedASFRequest} from '../utils/asf';
import {longReplyToInteraction} from '../utils/printing';
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
    const accounts: string = interaction.options.getString('accounts') ?? '';
    const nickname: string = interaction.options.getString('nickname') ?? '';
    const message: string = await privilegedASFRequest(interaction, 'nickname', `${accounts} ${nickname}`, 32);

    await longReplyToInteraction(interaction, message);
  }
};
