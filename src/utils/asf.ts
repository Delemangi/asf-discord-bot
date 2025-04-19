import { type ChatInputCommandInteraction, type User } from 'discord.js';

import { type AsfResponse } from '../types/AsfResponse.js';
import { configuration } from './config.js';
import { logger } from './logger.js';
import { getString } from './strings.js';

const all = '[all]';

const commandEndpoint = '/api/command';

export const checkASFPermissions = (user: string, account = '') => {
  const permissions = configuration('ASFPermissions');
  const userPermissions = permissions[user] ?? [];

  return userPermissions.includes(account) || userPermissions.includes(all);
};

export const sendASFRequest = async (
  interaction: ChatInputCommandInteraction,
  command: string,
  args: string,
) => {
  const settings = {
    body: JSON.stringify({ Command: `${command} ${args}` }),
    headers: {
      Authentication: configuration('ASFPassword'),
      'Content-Type': 'application/json',
    },
    method: 'POST',
  };
  const result = await fetch(
    `http://${configuration('ASF')}${commandEndpoint}`,
    settings,
  );

  if (!result.ok) {
    logger.error(
      `The ASF request ${command} ${args} from interaction ${interaction.id} failed: ${result.status} ${result.statusText}`,
    );

    return getString('error');
  }

  // @ts-expect-error returns unknown - fix later
  const json: AsfResponse = await result.json();
  return json.Result;
};

export const sendPrivilegedASFRequest = async (
  interaction: ChatInputCommandInteraction,
  command: string,
  args: string,
  numberExtraArgs = 0,
) => {
  const [accounts, ...extraArgs] = args.split(' ');

  // this shouldn't ever happen
  if (accounts === undefined) {
    return getString('error');
  }

  if (numberExtraArgs < extraArgs.length) {
    return getString('tooManyArguments');
  }

  const output: string[] = [];
  let message: string;

  for (const account of accounts.split(',')) {
    if (accounts !== '' && account === '') {
      continue;
    }

    message = checkASFPermissions(interaction.user.id, account)
      ? await sendASFRequest(
          interaction,
          command,
          `${account} ${extraArgs.join(' ')}`.trim(),
        )
      : `<${account}> ${getString('noBotPermission')}`;

    output.push(message);
  }

  return output.join('\n');
};

export const sendASFOrMailRequest = async (
  interaction: ChatInputCommandInteraction,
  command: string,
  accounts: string,
) => {
  const output: string[] = [];
  const bots = accounts.split(',');
  const request = await sendPrivilegedASFRequest(
    interaction,
    command,
    accounts,
  );
  const ASF = request.split('\n');

  for (const [index, bot] of bots.entries()) {
    if (checkASFPermissions(interaction.user.id, bot)) {
      output.push(ASF[index] ?? '');
    } else {
      output.push(`<${bot}> ${getString('noBotPermission')}`);
    }
  }

  return output.join('\n');
};

export const executeASFCommand = async (
  interaction: ChatInputCommandInteraction,
  command: string,
  args: string[],
) => {
  if (checkASFPermissions(interaction.user.id)) {
    return await sendASFRequest(interaction, command, args.join(' '));
  }

  return getString('noCommandPermission');
};

export const permissionsCommand = (user: User) => {
  const permissions = configuration('ASFPermissions')[user.id];

  if (permissions === undefined || permissions.length === 0) {
    return `<${user.tag}> Permissions: -`;
  }

  if (permissions.includes(all)) {
    return `<${user.tag}> Permissions: All`;
  }

  return `<${user.tag}> Permissions: ${permissions.join(', ')}`;
};
