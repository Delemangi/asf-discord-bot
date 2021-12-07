import type {CommandInteraction} from 'discord.js';
import axios from 'axios';
import {get2FAFromMail, getConfirmationFromMail} from './mail';
import {logger} from './logger';
import {strings} from './strings';
import {config} from '../config';

const cases: string[] = [
    `Couldn't find any bot named`,
    `This bot doesn't have ASF 2FA enabled!`,
    `This bot instance is not connected!`,
];

export async function ASFRequest(interaction: CommandInteraction, command: string, args: string): Promise<string> {
    if (!config.asfChannels.includes(interaction.channelId)) {
        return strings.invalidChannel;
    } else {
        if (!interaction.deferred) {
            await interaction.deferReply();
            logger.debug('The reply has been deferred');
        }

        return axios({
            method: 'post',
            url: config.asfAPI,
            headers: {
                'Content-Type': 'application/json',
                'Authentication': config.asfPassword
            },
            data: {
                'Command': `${command} ${args}`
            }
        })
            .then((response) => {
                logger.debug('ASF responded to the request');

                if (response.data.hasOwnProperty('Success')) {
                    return response.data['Result'];
                } else {
                    return strings.malformedResponse;
                }
            })
            .catch(error => {
                if (error.response) {
                    logger.error(error.response.data);
                    logger.error(error.response.status);
                    logger.error(error.response.headers);

                    return strings.badResponse;
                } else if (error.request) {
                    logger.error(error.request);

                    return strings.requestFailed;
                } else {
                    logger.error(error.message);
                    logger.error(error.response.data);

                    return strings.unknownError;
                }
            });
    }
}

export async function privilegedASFRequest(interaction: CommandInteraction, command: string, args: string, numExtraArgs: number = 0): Promise<string> {
    if (!config.asfChannels.includes(interaction.channelId)) {
        return strings.invalidChannel;
    } else {
        let [accounts, ...extraArgs] = args.split(' ');

        if (numExtraArgs < extraArgs.length) {
            return strings.tooManyArguments;
        }

        let output: string[] = [];
        let message: string;

        for (const account of accounts.split(',')) {
            if (account === '') {
                continue;
            } else if (permissionCheck(interaction, account)) {
                message = await ASFRequest(interaction, command, `${account} ${extraArgs.join(' ')}`.trim());
            } else {
                message = `<${account}> ${strings.noBotPermission}`;
            }

            output.push(message);
        }

        return output.join('\n');
    }
}

export async function ASFThenMail(interaction: CommandInteraction, command: string, accounts: string): Promise<string> {
    if (!config.asfChannels.includes(interaction.channelId)) {
        return strings.invalidChannel;
    } else {
        let output: string[] = [];
        let bots: string[] = accounts.split(',');
        let asf: string[] = (await privilegedASFRequest(interaction, command, accounts)).split('\n');

        for (let i = 0; i < bots.length; i++) {
            if (cases.some((line) => asf[i].includes(line))) {
                if (command === '2fa') {
                    if (permissionCheck(interaction, bots[i])) {
                        output.push(await get2FAFromMail(bots[i]));
                    } else {
                        output.push(`<${bots[i]}> ${strings.noBotPermission}`);
                    }
                } else if (command === '2faok') {
                    if (permissionCheck(interaction, bots[i])) {
                        output.push(await getConfirmationFromMail(bots[i]));
                    } else {
                        output.push(`<${bots[i]}> ${strings.noBotPermission}`);
                    }
                }
            } else {
                if (command === '2fa') {
                    if (permissionCheck(interaction, bots[i])) {
                        output.push(asf[i]);
                    } else {
                        output.push(`<${bots[i]}> ${strings.noBotPermission}`);
                    }
                } else if (command === '2faok') {
                    if (permissionCheck(interaction, bots[i])) {
                        output.push(asf[i]);
                    } else {
                        output.push(`<${bots[i]}> ${strings.noBotPermission}`);
                    }
                }
            }
        }

        return output.join('\n');
    }
}

export function permissionCheck(interaction: CommandInteraction, account: string = ''): boolean {
    const author: string = interaction.user.id;

    return author in config.asfPermissions && (config.asfPermissions[author].includes(account) || config.asfPermissions[author] === 'All');
}
