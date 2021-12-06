import type {CommandInteraction} from 'discord.js';
import {SlashCommandBuilder} from '@discordjs/builders';
import {replyToInteraction} from '../utils/printing';
import {ASFThenMail} from '../utils/asf';
import {descriptions} from '../utils/strings';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('2faok')
        .setDescription(descriptions._2faok)
        .addStringOption((option) => option
            .setName('accounts')
            .setDescription('Accounts')
            .setRequired(true)),

    async execute(interaction: CommandInteraction) {
        const output = await ASFThenMail(interaction, '2faok', interaction.options.getString('accounts') ?? '') ?? '';

        await replyToInteraction(interaction, output);
    },
};
