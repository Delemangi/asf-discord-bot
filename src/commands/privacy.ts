import type {CommandInteraction} from 'discord.js';
import {SlashCommandBuilder} from '@discordjs/builders';
import {replyToInteraction} from '../utils/printing';
import {privilegedASFRequest} from '../utils/asf';
import {descriptions} from '../utils/strings';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('privacy')
        .setDescription(descriptions.privacy)
        .addStringOption((option) => option
            .setName('accounts')
            .setDescription('Accounts')
            .setRequired(true))
        .addStringOption((option) => option
            .setName('settings')
            .setDescription('Privacy settings')
            .setRequired(true)),

    async execute(interaction: CommandInteraction) {
        const output: string = await privilegedASFRequest(interaction, 'privacy', `${interaction.options.getString('accounts')} ${interaction.options.getString('settings')}`, 2);

        await replyToInteraction(interaction, output);
    },
};
