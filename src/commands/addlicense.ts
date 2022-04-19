import {SlashCommandBuilder} from '@discordjs/builders';
import type {CommandInteraction} from 'discord.js';
import {privilegedASFRequest} from '../utils/asf';
import {longReplyToInteraction} from '../utils/printing';
import {descriptions} from '../utils/strings';

module.exports = {
  data: new SlashCommandBuilder()
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
    const accounts: string = interaction.options.getString('accounts') ?? '';
    const apps: string = interaction.options.getString('apps') ?? '';
    const output: string = await privilegedASFRequest(interaction, 'addlicense', `${accounts} ${apps}`, 2);
    const message: string = output.split('\n').filter((line) => line.length > 2).join('\n');

    await longReplyToInteraction(interaction, message);
  }
};
