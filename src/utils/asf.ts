import {
  type User,
  type CommandInteraction
} from 'discord.js';
import {configuration} from './config.js';
import {logger} from './logger.js';
import {
  getGuardCodeFromMail,
  getConfirmationFromMail
} from './mail.js';
import {getString} from './strings.js';

const all = '[all]';
const cases: string[] = [
  'Couldn\'t find any bot named',
  'This bot doesn\'t have ASF 2FA enabled!',
  'This bot instance is not connected!'
];
const functions: {[index: string]: Function} = {
  '2fa': getGuardCodeFromMail,
  '2faok': getConfirmationFromMail
};

export async function sendASFRequest (interaction: CommandInteraction, command: string, args: string): Promise<string> {
  logger.debug(`Processing the ASF request #${interaction.id}: ${command} ${args}`);

  if (!(configuration('ASFChannels') as string[]).includes(interaction.channelId)) {
    logger.debug(`Interaction ${interaction.id} was requsted from a bad channel.`);

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
  const result: Response = await fetch(configuration('ASFAPI') as string, settings);

  if (!result.ok) {
    logger.error(`The ASF request failed\n${result.status} ${result.statusText}\n${result.body}`);

    return getString('unknownError');
  }

  logger.debug('The ASF request succeeded');

  return (await result.json()).Result;
}

export async function sendPrivilegedASFRequest (interaction: CommandInteraction, command: string, args: string, numberExtraArgs: number = 0): Promise<string> {
  logger.debug(`Processing the privileged ASF request #${interaction.id}: ${command} ${args}`);

  if (!(configuration('ASFChannels') as string[]).includes(interaction.channelId)) {
    logger.debug(`Interaction ${interaction.id} was requsted from a bad channel.`);

    return getString('invalidChannel');
  }

  const [accounts, ...extraArgs]: string[] = args.split(' ');

  if (numberExtraArgs < extraArgs.length) {
    logger.debug(`Interaction ${interaction.id} had too many arguments passed.`);

    return getString('tooManyArguments');
  }

  const output: string[] = [];
  let message: string;

  for (const account of (accounts as string).split(',')) {
    if (account === '') {
      continue;
    }

    if (checkASFPermissions(interaction.user.id, account)) {
      message = await sendASFRequest(interaction, command, `${account} ${extraArgs.join(' ')}`.trim());
    } else {
      message = `<${account}> ${getString('noBotPermission')}`;
    }

    output.push(message);
  }

  return output.join('\n');
}

export async function sendASFOrMailRequest (interaction: CommandInteraction, command: string, accounts: string): Promise<string> {
  logger.debug(`Processing the ASF/Mail request #${interaction.id}: ${command} ${accounts}`);

  const output: string[] = [];
  const bots: string[] = accounts.split(',');
  const ASF: string[] = (await sendPrivilegedASFRequest(interaction, command, accounts)).split('\n');

  for (const [index, bot] of bots.entries()) {
    if (!checkASFPermissions(interaction.user.id, bot)) {
      output.push(`<${bot}> ${getString('noBotPermission')}`);
    } else if (cases.some((value) => (ASF[index] as string).includes(value))) {
      output.push(await (functions[command] as Function)(bot));
    } else {
      output.push(ASF[index] as string);
    }
  }

  return output.join('\n');
}

export async function doASFCommand (interaction: CommandInteraction, command: string, args: string[]): Promise<string> {
  if (checkASFPermissions(interaction.user.id)) {
    return await sendASFRequest(interaction, command, args.join(' '));
  }

  return getString('noCommandPermission');
}

export function checkASFPermissions (user: string, account: string = ''): boolean {
  const permissions: {[index: string]: string[]} = configuration('ASFPermissions') as {[index: string]: string[]};
  const userPermissions: string[] = permissions[user] ?? [];

  return userPermissions.includes(account) || userPermissions.includes(all);
}

export function permissionsASFCommand (user: User): string {
  const permissions: string[] | undefined = (configuration('ASFPermissions') as {[index: string]: string[]})[user.id];

  if (permissions === undefined || permissions.length === 0) {
    return `<${user.tag}> -`;
  }

  if (permissions.includes(all)) {
    return `<${user.tag}> All`;
  }

  return `<${user.tag}> ${permissions.join(', ')}`;
}
