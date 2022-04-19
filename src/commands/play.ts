import {SlashCommandBuilder} from '@discordjs/builders';
import type {CommandInteraction} from 'discord.js';
import {privilegedASFRequest} from '../utils/asf';
import {longReplyToInteraction} from '../utils/printing';
import {descriptions} from '../utils/strings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription(descriptions.play)
    .addStringOption((option) => option
      .setName('accounts')
      .setDescription('Accounts')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('apps')
      .setDescription('Apps')
      .setRequired(true)),

  async execute (interaction: CommandInteraction) {
    const accounts: string = interaction.options.getString('accounts') ?? '';
    const apps: string = interaction.options.getString('apps') ?? '';
    const message: string = await privilegedASFRequest(interaction, 'play', `${accounts} ${apps}`, 2);

    await longReplyToInteraction(interaction, message);
  }
};
