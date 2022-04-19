import axios from 'axios';
import type {CommandInteraction} from 'discord.js';
import {configuration} from './config';
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
const functions: {[index: string]: Function} = {
  '2fa': get2FAFromMail,
  '2faok': getConfirmationFromMail
};

export async function ASFRequest (interaction: CommandInteraction, command: string, args: string): Promise<string> {
  logger.debug(`Processing the ASF request #${interaction.id}: ${command} ${args}`);

  if (!configuration('ASFChannels').includes(interaction.channelId)) {
    logger.debug(`Interaction ${interaction.id} was requsted from a bad channel.`);
    return strings.invalidChannel;
  }

  return axios({
    data: {Command: `${command} ${args}`},
    headers: {
      Authentication: configuration('ASFPassword'),
      'Content-Type': 'application/json'
    },
    method: 'post',
    url: configuration('ASFAPI')
  })
    .then((response) => {
      logger.debug(`The ASF request succeeded\n${response.data}`);

      if (response.data.Success === undefined) {
        return strings.malformedResponse;
      }

      return response.data.Result;
    })
    .catch((error) => {
      if (error.response) {
        logger.error(`The ASF request failed\n${error.response.data}\n${error.response.status}\n${error.response.headers}`);
        return strings.badResponse;
      }

      if (error.request) {
        logger.error(`The ASF request failed\n${error.request}`);
        return strings.requestFailed;
      }

      logger.error(`The ASF request failed\n${error.message}\n${error.response.data}`);
      return strings.unknownError;
    });
}

export async function privilegedASFRequest (interaction: CommandInteraction, command: string, args: string, numberExtraArgs: number = 0): Promise<string> {
  logger.debug(`Processing the privileged ASF request #${interaction.id}: ${command} ${args}`);

  if (!configuration('ASFChannels').includes(interaction.channelId)) {
    logger.debug(`Interaction ${interaction.id} was requsted from a bad channel.`);
    return strings.invalidChannel;
  }

  const [accounts, ...extraArgs]: string[] = args.split(' ');

  if (numberExtraArgs < extraArgs.length) {
    logger.debug(`Interaction ${interaction.id} had too many arguments passed.`);
    return strings.tooManyArguments;
  }

  const output: string[] = [];
  let message: string;

  for (const account of accounts.split(',')) {
    if (account === '') {
      continue;
    }

    if (ASFPermissionCheck(interaction.user.id, account)) {
      message = await ASFRequest(interaction, command, `${account} ${extraArgs.join(' ')}`.trim());
    } else {
      message = `<${account}> ${strings.noBotPermission}`;
    }

    output.push(message);
  }

  return output.join('\n');
}

export async function ASFThenMail (interaction: CommandInteraction, command: string, accounts: string): Promise<string> {
  logger.debug(`Processing the ASF/Mail request #${interaction.id}: ${command} ${accounts}`);

  if (!configuration('ASFChannels').includes(interaction.channelId)) {
    logger.debug(`Interaction ${interaction.id} was requested from a bad channel.`);
    return strings.invalidChannel;
  }

  const output: string[] = [];
  const bots: string[] = accounts.split(',');
  const ASF: string[] = (await privilegedASFRequest(interaction, command, accounts)).split('\n');

  for (const [index, bot] of bots.entries()) {
    if (!ASFPermissionCheck(interaction.user.id, bot)) {
      output.push(`<${bot}> ${strings.noBotPermission}`);
    } else if (cases.some((value) => ASF[index].includes(value))) {
      output.push(await functions[command](bot));
    } else {
      output.push(ASF[index]);
    }
  }

  return output.join('\n');
}

export async function ASFCommand (interaction: CommandInteraction, command: string, args: string[]): Promise<string> {
  if (ASFPermissionCheck(interaction.user.id)) {
    return ASFRequest(interaction, command, args.join(' '));
  }

  return strings.noCommandPermission;
}

export function ASFPermissionCheck (user: string, account: string = ''): boolean {
  const permissions: {[index: string]: string[]} = configuration('ASFPermissions');

  return user in permissions && (permissions[user].includes(account) || permissions[user].includes('All'));
}
