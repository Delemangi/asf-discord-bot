import {readFileSync} from 'node:fs';
import {readFile} from 'node:fs/promises';

const defaultConfig: Config = {
  applicationID: '',
  ASFAPI: '',
  ASFChannels: [],
  ASFLogChannels: [],
  ASFPassword: '',
  ASFPermissions: {},
  ASFWS: '',
  database: {
    host: '',
    password: '',
    user: ''
  },
  devMode: false,
  guilds: [],
  logLevel: 'info',
  mailInterval: 15,
  mails: [],
  permissions: {},
  reminderInterval: 10_000,
  roles: {},
  token: ''
};
let config: Partial<Config> = {};

if (Object.keys(config).length === 0) {
  loadConfig();
}

export function configuration<T extends keyof Config> (property: T): Config[T] {
  return config[property] ?? defaultConfig[property];
}

export async function reloadConfig (): Promise<void> {
  const groups: {[index: string]: string[]} = JSON.parse(await readFile('./config/groups.json', 'utf8'));
  config = JSON.parse(await readFile('./config/config.json', 'utf8'));
  const property = config.ASFPermissions;

  if (property === undefined) {
    return;
  }

  for (const key of Object.keys(property)) {
    for (const group of Object.keys(groups)) {
      if (property[key]?.includes(`[${group}]`)) {
        property[key] = property[key]?.filter((value) => value !== `[${group}]`) ?? [];
        property[key]?.push(...groups[group] as string[]);
      }
    }
  }
}

export function loadConfig (): void {
  config = JSON.parse(readFileSync('./config/config.json', 'utf8'));
  const groups: {[index: string]: string[]} = JSON.parse(readFileSync('./config/groups.json', 'utf8'));
  const property = config.ASFPermissions;

  if (property === undefined) {
    return;
  }

  for (const key of Object.keys(property)) {
    for (const group of Object.keys(groups)) {
      if (property[key]?.includes(`[${group}]`)) {
        property[key] = property[key]?.filter((value) => value !== `[${group}]`) ?? [];
        property[key]?.push(...groups[group] as string[]);
      }
    }
  }
}
