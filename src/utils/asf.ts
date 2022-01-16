import axios from 'axios';
import type {CommandInteraction} from 'discord.js';
import {config} from '../config';
import {logger} from './logger';
import {
  get2FAFromMail,
  getConfirmationFromMail
} from './mail';
import {strings} from './strings';

const cases: string[] = [
  'Couldn\'t find any bot named',
  'This bot doesn\'t have ASF 2FA enabled!',
  'This bot instance is not connected!'
];

export async function ASFRequest (interaction: CommandInteraction, command: string, args: string): Promise<string> {
  logger.debug(`Processing the ASF request: ${command} ${args}`);

  if (!config.asfChannels.includes(interaction.channelId)) {
    return strings.invalidChannel;
  }

  if (!interaction.deferred) {
    await interaction.deferReply();
    logger.debug('The interaction has been deferred');
  }

  return axios({
    data: {Command: `${command} ${args}`},
    headers: {
      Authentication: config.asfPassword,
      'Content-Type': 'application/json'
    },
    method: 'post',
    url: config.asfAPI
  })
    .then((response) => {
      logger.debug('The ASF request succeeded');

      if (response.data.Success === undefined) {
        return strings.malformedResponse;
      }

      return response.data.Result;
    })
    .catch((error) => {
      if (error.response) {
        logger.error(`The ASF request failed: ${error.response.data} | ${error.response.status} | ${error.response.headers}`);
        return strings.badResponse;
      }

      if (error.request) {
        logger.error(`The ASF request failed: ${error.request}`);
        return strings.requestFailed;
      }

      logger.error(`The ASF request failed: ${error.message} | ${error.response.data}`);
      return strings.unknownError;
    });
}

export async function privilegedASFRequest (interaction: CommandInteraction, command: string, args: string, numberExtraArgs: number = 0): Promise<string> {
  logger.debug(`Processing the privileged ASF request: ${command} ${args}`);

  if (!config.asfChannels.includes(interaction.channelId)) {
    return strings.invalidChannel;
  }

  const [accounts, ...extraArgs] = args.split(' ');

  if (numberExtraArgs < extraArgs.length) {
    return strings.tooManyArguments;
  }

  const output: string[] = [];
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

export async function ASFThenMail (interaction: CommandInteraction, command: string, accounts: string): Promise<string> {
  logger.debug(`Processing ASF or mail request: ${command} ${accounts}`);

  if (!config.asfChannels.includes(interaction.channelId)) {
    return strings.invalidChannel;
  }

  const output: string[] = [];
  const bots: string[] = accounts.split(',');
  const asf: string[] = (await privilegedASFRequest(interaction, command, accounts)).split('\n');

  for (const [index, bot] of bots.entries()) {
    if (cases.some((value) => asf[index].includes(value))) {
      if (command === '2fa') {
        if (permissionCheck(interaction, bot)) {
          output.push(await get2FAFromMail(bot));
        } else {
          output.push(`<${bot}> ${strings.noBotPermission}`);
        }
      } else if (command === '2faok') {
        if (permissionCheck(interaction, bot)) {
          output.push(await getConfirmationFromMail(bot));
        } else {
          output.push(`<${bot}> ${strings.noBotPermission}`);
        }
      }
    } else if (command === '2fa') {
      if (permissionCheck(interaction, bot)) {
        output.push(asf[index]);
      } else {
        output.push(`<${bot}> ${strings.noBotPermission}`);
      }
    } else if (command === '2faok') {
      if (permissionCheck(interaction, bot)) {
        output.push(asf[index]);
      } else {
        output.push(`<${bot}> ${strings.noBotPermission}`);
      }
    }
  }

  return output.join('\n');
}

export function permissionCheck (interaction: CommandInteraction, account: string = ''): boolean {
  const author: string = interaction.user.id;

  return author in config.asfPermissions && (config.asfPermissions[author].includes(account) || config.asfPermissions[author] === 'All');
}
