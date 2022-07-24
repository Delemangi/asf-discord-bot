import {
  type ChatInputCommandInteraction,
  type User
} from 'discord.js';
import {configuration} from './config.js';
import {logger} from './logger.js';
import {
  getGuardCodeFromMail,
  getConfirmationFromMail
} from './mail.js';
import {getString} from './strings.js';

const all = '[all]';
const cases = [
  'Couldn\'t find any bot named',
  'This bot doesn\'t have ASF 2FA enabled!',
  'This bot instance is not connected!'
];
const functions: {[index: string]: Function} = {
  '2fa': getGuardCodeFromMail,
  '2faok': getConfirmationFromMail
};

export async function sendASFRequest (interaction: ChatInputCommandInteraction, command: string, args: string): Promise<string> {
  logger.debug(`Executing the ASF request ${command} ${args} from interaction ${interaction.id}`);

  if (!configuration('ASFChannels').includes(interaction.channelId)) {
    logger.debug(`The ASF request ${command} ${args} from interaction ${interaction.id} was requsted from an invalid channel`);

    return getString('invalidChannel');
  }

  const settings: {} = {
    body: JSON.stringify({Command: `${command} ${args}`}),
    headers: {
      Authentication: configuration('ASFPassword'),
      'Content-Type': 'application/json'
    },
    method: 'POST'
  };
  const result = await fetch(configuration('ASFAPI'), settings);

  if (!result.ok) {
    logger.error(`The ASF request ${command} ${args} from interaction ${interaction.id} failed: ${result.status} ${result.statusText}`);

    return getString('error');
  }

  logger.debug(`The ASF request ${command} ${args} from interaction ${interaction.id} succeeded: ${result.status} ${result.statusText}`);

  const json = await result.json();
  return json.Result;
}

export async function sendPrivilegedASFRequest (interaction: ChatInputCommandInteraction, command: string, args: string, numberExtraArgs: number = 0): Promise<string> {
  logger.debug(`Executing the privileged ASF request ${command} ${args} from interaction ${interaction.id}`);

  if (!configuration('ASFChannels').includes(interaction.channelId)) {
    logger.debug(`The ASF request ${command} ${args} from interaction ${interaction.id} was requsted from an invalid channel`);

    return getString('invalidChannel');
  }

  const [accounts, ...extraArgs] = args.split(' ');

  // this shouldn't ever happen
  if (accounts === undefined) {
    logger.error(`The ASF request ${command} ${args} from interaction ${interaction.id} received undefined accounts`);

    return getString('error');
  }

  if (numberExtraArgs < extraArgs.length) {
    logger.debug(`The ASF request ${command} ${args} from interaction ${interaction.id} had too many arguments passed`);

    return getString('tooManyArguments');
  }

  const output: string[] = [];
  let message: string;

  for (const account of accounts.split(',')) {
    if (accounts !== '' && account === '') {
      continue;
    }

    if (checkASFPermissions(interaction.user.id, account)) {
      message = await sendASFRequest(interaction, command, `${account} ${extraArgs.join(' ')}`.trim());
    } else {
      message = `<${account}> ${getString('noBotPermission')}`;
    }

    output.push(message);
  }

  logger.debug(`The privileged ASF request ${command} ${args} from interaction ${interaction.id} succeeded`);

  return output.join('\n');
}

export async function sendASFOrMailRequest (interaction: ChatInputCommandInteraction, command: string, accounts: string): Promise<string> {
  logger.debug(`Executing the ASF or mail request ${command} ${accounts} from interaction ${interaction.id}`);

  const output: string[] = [];
  const bots = accounts.split(',');
  const ASF = (await sendPrivilegedASFRequest(interaction, command, accounts)).split('\n');

  for (const [index, bot] of bots.entries()) {
    if (!checkASFPermissions(interaction.user.id, bot)) {
      output.push(`<${bot}> ${getString('noBotPermission')}`);
    } else if (cases.some((value) => (ASF[index] ?? '').includes(value))) {
      output.push(await (functions[command] as Function)(bot));
    } else {
      output.push(ASF[index] ?? '');
    }
  }

  logger.debug(`The ASF or mail request ${command} ${accounts} from interaction ${interaction.id} succeeded`);

  return output.join('\n');
}

export async function doASFCommand (interaction: ChatInputCommandInteraction, command: string, args: string[]): Promise<string> {
  if (checkASFPermissions(interaction.user.id)) {
    return await sendASFRequest(interaction, command, args.join(' '));
  }

  return getString('noCommandPermission');
}

export function checkASFPermissions (user: string, account: string = ''): boolean {
  const permissions = configuration('ASFPermissions');
  const userPermissions = permissions[user] ?? [];

  return userPermissions.includes(account) || userPermissions.includes(all);
}

export function permissionsASFCommand (user: User): string {
  const permissions = configuration('ASFPermissions')[user.id];

  if (permissions === undefined || permissions.length === 0) {
    return `<${user.tag}> ASF Permissions: -`;
  }

  if (permissions.includes(all)) {
    return `<${user.tag}> ASF Permissions: All`;
  }

  return `<${user.tag}> ASF Permissions: ${permissions.join(', ')}`;
}
