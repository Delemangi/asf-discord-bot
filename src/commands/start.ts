import type {CommandInteraction} from 'discord.js';
import {SlashCommandBuilder} from '@discordjs/builders';
import {replyToInteraction} from '../utils/printing';
import {privilegedASFRequest} from '../utils/asf';
import {descriptions} from '../utils/strings';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription(descriptions.start)
        .addStringOption((option) => option
            .setName('accounts')
            .setDescription('Accounts')
            .setRequired(true)),

    async execute(interaction: CommandInteraction) {
        const output: string = await privilegedASFRequest(interaction, 'start', `${interaction.options.getString('accounts')}`);

        await replyToInteraction(interaction, output);
    },
};
