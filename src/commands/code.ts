import type {CommandInteraction} from 'discord.js';
import {SlashCommandBuilder} from '@discordjs/builders';
import {replyToInteraction} from '../utils/printing';
import {getCode} from "../utils/code";
import {descriptions} from '../utils/strings';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('code')
        .setDescription(descriptions.code),

    async execute(interaction: CommandInteraction) {
        const output: string = getCode(interaction);

        await replyToInteraction(interaction, output);
    },
};
