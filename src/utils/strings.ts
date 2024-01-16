const strings: { [index: string]: string } = {
  emptyMessage: 'Received an empty message. Perhaps you should report it.',
  error:
    'An error occurred while executing the command. Perhaps you should report it.',
  invalidChannel: 'You cannot run that command in this channel.',
  noBotPermission: 'You do not have permission to use that bot.',
  noCommandPermission: 'You do not have permission to use that command.',
  tooManyArguments: 'You have given too many arguments for the command.',
};

const descriptions: { [index: string]: string } = {
  '2fa': "Get bots' 2FA",
  '2fano': "Deny bots' confirmations",
  '2faok': "Confirm bots' confirmations",
  addlicense: 'Activate licenses on bots',
  asf: 'Call any ASF command',
  balance: "Get bots' wallet balance",
  farm: 'Restart idling on bots',
  level: "Get bots' level",
  load: 'Reload settings',
  nickname: "Change bot's nickname",
  oa: 'ASF: Get bots that own an app or sub',
  permissions: "Get a user's permissions",
  play: 'Play games on bots',
  points: "Get bots' points in Steam store",
  privacy: "Set bots' privacy settings",
  redeem: 'Redeem CD keys on bots',
  reset: 'Stop playing games on bots',
  resume: 'Resume idling on bots',
  sa: 'Get status of all bots',
  start: 'Start bots',
  status: 'Get status of bots',
  stop: 'Stop bots',
  transfer: 'Transfer items between bots',
  unpack: 'Unpack boosters on bots',
};

export const getString = (name: string) => {
  return (
    strings[name] ?? 'No string found. Perhaps you should report this error.'
  );
};

export const getDescription = (name: string) => {
  return (
    descriptions[name] ??
    'No description found. Perhaps you should report this error.'
  );
};
