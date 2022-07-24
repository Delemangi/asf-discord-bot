const strings: Strings = {
  emptyMessage: 'Received an empty message. Perhaps you should report it.',
  error: 'An error occurred while executing the command. Perhaps you should report it.',
  invalidChannel: 'You cannot run that command in this channel.',
  noBotPermission: 'You do not have permission to use that bot.',
  noCommandPermission: 'You do not have permission to use that command.',
  tooManyArguments: 'You have given too many arguments for the command.'
};

const descriptions: Descriptions = {
  '2fa': 'ASF: Get bots\' 2FA',
  '2fano': 'ASF: Deny bots\' confirmations',
  '2faok': 'ASF: Confirm bots\' confirmations',
  addlicense: 'ASF: Activate licenses on bots',
  asf: 'ASF: Call any ASF command',
  asfpermissions: 'ASF: Get a user\'s permissions',
  balance: 'ASF: Get bots\' wallet balance',
  code: 'Rust: Generate a pseudo random unbiased 4 digit code',
  convert: 'Any: Convert between 2 currencies',
  farm: 'ASF: Restart idling on bots',
  invite: 'Any: Get Discord invite URL',
  level: 'ASF: Get bots\' level',
  load: 'Any: Reload settings',
  market: 'Any: Get Steam market listings',
  nickname: 'ASF: Change bot\'s nickname',
  oa: 'ASF: Get bots that own an app or sub',
  permissions: 'Any: Get a user\'s permissions',
  ping: 'Any: Check latency',
  play: 'ASF: Play games on bots',
  points: 'ASF: Get bots\' points in Steam store',
  privacy: 'ASF: Set bots\' privacy settings',
  redeem: 'ASF: Redeem CD keys on bots',
  reminder: 'Any: Set a reminder',
  reset: 'ASF: Stop playing games on bots',
  resume: 'ASF: Resume idling on bots',
  roles: 'Any: Get a user\'s roles',
  sa: 'ASF: Get status of all bots',
  setvar: 'Any: Set a variable',
  start: 'ASF: Start bots',
  status: 'ASF: Get status of bots',
  stop: 'ASF: Stop bots',
  transfer: 'ASF: Transfer items between bots',
  unpack: 'ASF: Unpack boosters on bots'
};

export function getString<T extends keyof Strings> (name: T): string {
  return strings[name];
}

export function getDescription<T extends keyof Descriptions> (name: T): string {
  return descriptions[name];
}
