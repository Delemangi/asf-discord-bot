const strings: {[index: string]: string} = {
  invalidChannel: 'You cannot run that command in this channel.',
  noBotPermission: 'The bot does not exist or you do not have permission.',
  noCommandPermission: 'You do not have permission to use that command.',
  tooManyArguments: 'Too many arguments have been supplied.',
  unknownError: 'An error occurred.'
};

const descriptions: {[index: string]: string} = {
  '2fa': 'ASF: Get bots\' 2FA',
  '2fano': 'ASF: Deny bots\' confirmations',
  '2faok': 'ASF: Confirm bots\' confirmations',
  addlicense: 'ASF: Activate licenses on bots',
  asf: 'ASF: Call any ASF command',
  asfpermissions: 'ASF: Get your own permissions',
  balance: 'ASF: Get bots\' wallet balance',
  code: 'Rust: Generate a pseudo random unbiased 4 digit code',
  convert: 'Any: Convert between 2 currencies',
  farm: 'ASF: Restart idling on bots',
  invite: 'Any: Get Discord invite URL',
  level: 'ASF: Get bots\' level',
  load: 'Any: Reload settings',
  market: 'Any: Get Steam market listings',
  nickname: 'ASF: Change bot\'s nickname',
  oa: 'ASF: Get bots owning an app',
  permissions: 'Any: Get your own permissions',
  ping: 'Any: Check latency',
  play: 'ASF: Play games on bots',
  points: 'ASF: Get bots\' points in Steam store',
  privacy: 'ASF: Set bots\' privacy settings',
  redeem: 'ASF: Redeem CD keys on bots',
  reminder: 'Any: Set a reminder',
  reset: 'ASF: Stop playing games on bots',
  resume: 'ASF: Resume idling on bots',
  roles: 'Any: Get your own roles',
  sa: 'ASF: Get status of all bots',
  setvar: 'Any: Set a variable',
  start: 'ASF: Start bots',
  status: 'ASF: Get status of bots',
  stop: 'ASF: Stop bots',
  transfer: 'ASF: Transfer items between bots',
  unpack: 'ASF: Unpack boosters on bots',
  var: 'Any: Get a variable'
};

export function getString (name: string): string {
  return strings[name] ?? '';
}

export function getDescription (name: string): string {
  return descriptions[name] ?? '';
}
