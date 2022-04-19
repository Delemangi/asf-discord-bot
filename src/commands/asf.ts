import {SlashCommandBuilder} from '@discordjs/builders';
import type {CommandInteraction} from 'discord.js';
import {ASFCommand} from '../utils/asf';
import {longReplyToInteraction} from '../utils/printing';
import {descriptions} from '../utils/strings';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('asf')
    .setDescription(descriptions.asf)
    .addStringOption((option) => option
      .setName('command')
      .setDescription('Command')
      .setRequired(true)),

  async execute (interaction: CommandInteraction) {
    const args: string[] = interaction.options.getString('command')?.split(' ') ?? [];
    const command: string = args.shift() ?? '';
    const message: string = await ASFCommand(interaction, command, args);

    await longReplyToInteraction(interaction, message);
  }
};
