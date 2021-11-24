import {SlashCommandBuilder} from '@discordjs/builders';
import type {CommandInteraction} from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check if the bot is alive'),

    async execute(interaction: CommandInteraction) {
        await interaction.reply('pong');
    }
};