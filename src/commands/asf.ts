import type {CommandInteraction} from 'discord.js';
import {SlashCommandBuilder} from '@discordjs/builders';
import {replyToInteraction} from '../utils/printing';
import {ASFRequest, permissionCheck} from '../utils/asf';
import {strings, descriptions} from '../utils/strings';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('asf')
        .setDescription(descriptions.asf)
        .addStringOption((option) => option
            .setName('command')
            .setDescription('Command')
            .setRequired(true)),

    async execute(interaction: CommandInteraction) {
        let output: string = '';
        const split: string[] = interaction.options.getString('command')?.split(' ') ?? [];
        const command: string = split?.shift() ?? '';

        if (permissionCheck(interaction)) {
            output = await ASFRequest(interaction, command, split.join(' '));
        } else {
            output = strings.noCommandPermission;
        }

        await replyToInteraction(interaction, output);
    },
};
