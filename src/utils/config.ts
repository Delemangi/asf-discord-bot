import { readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';

const defaultConfig: Config = {
  applicationID: '',
  ASF: 'http://asf:1242',
  ASFLogChannels: [],
  ASFPassword: '',
  ASFPermissions: {},
  mails: [],
  token: '',
};
let config: Partial<Config> = {};

export const configuration = <T extends keyof Config>(
  property: T,
): Config[T] => {
  return config[property] ?? defaultConfig[property];
};

export const reloadConfig = async () => {
  const groups = JSON.parse(await readFile('./config/groups.json', 'utf8'));
  config = JSON.parse(await readFile('./config/config.json', 'utf8'));
  const property = config.ASFPermissions;

  if (property === undefined) {
    return;
  }

  for (const key of Object.keys(property)) {
    for (const group of Object.keys(groups)) {
      if (property[key]?.includes(`[${group}]`)) {
        property[key] =
          property[key]?.filter((value) => value !== `[${group}]`) ?? [];
        property[key]?.push(...(groups[group] as string[]));
      }
    }
  }
};

export const loadConfig = () => {
  config = JSON.parse(readFileSync('./config/config.json', 'utf8'));
  const groups = JSON.parse(readFileSync('./config/groups.json', 'utf8'));
  const property = config.ASFPermissions;

  if (property === undefined) {
    return;
  }

  for (const key of Object.keys(property)) {
    for (const group of Object.keys(groups)) {
      if (property[key]?.includes(`[${group}]`)) {
        property[key] =
          property[key]?.filter((value) => value !== `[${group}]`) ?? [];
        property[key]?.push(...(groups[group] as string[]));
      }
    }
  }
};

if (Object.keys(config).length === 0) {
  loadConfig();
}
