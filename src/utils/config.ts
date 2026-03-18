import { readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { z } from 'zod';

import { type Config, configSchema } from '../types/Config.js';

const partialConfigSchema = configSchema.partial();
type PartialConfig = Partial<Config>;

const parseConfig = (data: unknown): PartialConfig => {
  const parsed = partialConfigSchema.parse(data);
  const result: PartialConfig = {};

  for (const key of Object.keys(parsed) as Array<keyof Config>) {
    if (parsed[key] !== undefined) {
      Object.assign(result, { [key]: parsed[key] });
    }
  }

  return result;
};

const defaultConfig: Config = {
  admins: [],
  applicationID: '',
  ASF: 'http://asf:1242',
  ASFLogChannels: [],
  ASFPassword: '',
  ASFPermissions: {},
  mails: [],
  token: '',
};
let config: PartialConfig = {};

export const configuration = <T extends keyof Config>(property: T): Config[T] =>
  config[property] ?? defaultConfig[property];

const groupsSchema = z.record(z.string(), z.array(z.string()));

const expandGroups = (groups: z.infer<typeof groupsSchema>) => {
  const property = config.ASFPermissions;

  if (property === undefined) {
    return;
  }

  for (const key of Object.keys(property)) {
    for (const group of Object.keys(groups)) {
      if (property[key]?.includes(`[${group}]`)) {
        property[key] = property[key].filter((value) => value !== `[${group}]`);
        property[key].push(...(groups[group] ?? []));
      }
    }
  }
};

export const reloadConfig = async () => {
  const groups = groupsSchema.parse(
    JSON.parse(await readFile('./config/groups.json', 'utf8')),
  );
  config = parseConfig(
    JSON.parse(await readFile('./config/config.json', 'utf8')),
  );
  expandGroups(groups);
};

export const loadConfig = () => {
  config = parseConfig(
    JSON.parse(readFileSync('./config/config.json', 'utf8')),
  );
  const groups = groupsSchema.parse(
    JSON.parse(readFileSync('./config/groups.json', 'utf8')),
  );
  expandGroups(groups);
};

if (Object.keys(config).length === 0) {
  loadConfig();
}
