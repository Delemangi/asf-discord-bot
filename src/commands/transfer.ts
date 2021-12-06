import type {CommandInteraction} from 'discord.js';
import {SlashCommandBuilder} from '@discordjs/builders';
import {replyToInteraction} from '../utils/printing';
import {privilegedASFRequest} from '../utils/asf';
import {descriptions} from '../utils/strings';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transfer')
        .setDescription(descriptions.transfer)
        .addStringOption((option) => option
            .setName('accounts')
            .setDescription('Accounts')
            .setRequired(true))
        .addIntegerOption((option) => option
            .setName('app')
            .setDescription('App')
            .setRequired(true))
        .addIntegerOption((option) => option
            .setName('context')
            .setDescription('Context')
            .setRequired(true))
        .addIntegerOption((option) => option
            .setName('target')
            .setDescription('Target')
            .setRequired(true)),

    async execute(interaction: CommandInteraction) {
        const output: string = await privilegedASFRequest(interaction, 'transfer^', `${interaction.options.getString('accounts')} ${interaction.options.getInteger('app')} ${interaction.options.getInteger('context')} ${interaction.options.getInteger('target')}`, 4);

        await replyToInteraction(interaction, output);
    },
};
