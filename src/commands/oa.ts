import type {CommandInteraction} from 'discord.js';
import {SlashCommandBuilder} from '@discordjs/builders';
import {replyToInteraction} from '../utils/printing';
import {ASFRequest} from '../utils/asf';
import {descriptions} from '../utils/strings';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('oa')
        .setDescription(descriptions.oa)
        .addStringOption((option) => option
            .setName('game')
            .setDescription('Game')
            .setRequired(true)),

    async execute(interaction: CommandInteraction) {
        const output: string = await ASFRequest(interaction, 'oa', `${interaction.options.getString('game')}`);
        const split: string[] = output.split('\n');
        const buffer: string[] = [];

        for (const line of split) {
            if (line.length > 2 &&
                !line.includes('Not owned yet') &&
                !line.includes('gamesOwned is empty') &&
                !line.includes('This bot instance is not connected!') &&
                !line.includes('bots already own the game') &&
                line.includes('|')) {
                buffer.push(line);
            }
        }

        if (buffer.length === 0) {
            await replyToInteraction(interaction, '<ASF> No accounts own the queried game.');
        } else {
            await replyToInteraction(interaction, buffer.join('\n'));
        }
    },
};
