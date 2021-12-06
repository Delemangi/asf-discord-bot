import type {CommandInteraction} from 'discord.js';
import {SlashCommandBuilder} from '@discordjs/builders';
import {replyToInteraction} from '../utils/printing';
import {privilegedASFRequest} from '../utils/asf';
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

    async execute(interaction: CommandInteraction) {
        const output: string = await privilegedASFRequest(interaction, 'play', `${interaction.options.getString('accounts')} ${interaction.options.getString('apps')}`, 2);

        await replyToInteraction(interaction, output);
    },
};
