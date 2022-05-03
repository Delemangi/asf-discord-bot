import {readFileSync} from 'node:fs';
import {readFile} from 'node:fs/promises';

let defaultConfig: Config = {} as Config;
let config: Config = {} as Config;
const wildcards: string[] = [
  'ASFPermissions'
];

if (Object.keys(config).length === 0) {
  loadConfig();
}

export function configuration (property: string): ConfigProperty {
  return config[property] ?? defaultConfig[property] ?? '';
}

export async function reloadConfig (): Promise<void> {
  const configFile: string = await readFile('./config/config.json', 'utf8');
  config = JSON.parse(configFile);

  const defaultConfigFile: string = await readFile('./config/default.json', 'utf8');
  defaultConfig = JSON.parse(defaultConfigFile);

  const groupsFile: string = await readFile('./config/groups.json', 'utf8');
  const groups: {[index: string]: string[]} = JSON.parse(groupsFile);

  for (const wildcard of wildcards) {
    const property: {[index: string]: string[]} = config[wildcard] as {[index: string]: string[]};

    for (const key of Object.keys(property)) {
      for (const group of Object.keys(groups)) {
        if (property[key]?.includes(`[${group}]`)) {
          property[key] = property[key]?.filter((asd) => asd !== `[${group}]`) ?? [];
          property[key]?.push(...groups[group] as string[]);
        }
      }
    }
  }
}

export function loadConfig (): void {
  const configFile: string = readFileSync('./config/config.json', 'utf8');
  config = JSON.parse(configFile);

  const defaultConfigFile: string = readFileSync('./config/default.json', 'utf8');
  defaultConfig = JSON.parse(defaultConfigFile);

  const groupsFile: string = readFileSync('./config/groups.json', 'utf8');
  const groups: {[index: string]: string[]} = JSON.parse(groupsFile);

  for (const wildcard of wildcards) {
    const property: {[index: string]: string[]} = config[wildcard] as {[index: string]: string[]};

    for (const key of Object.keys(property)) {
      for (const group of Object.keys(groups)) {
        if (property[key]?.includes(`[${group}]`)) {
          property[key] = property[key]?.filter((asd) => asd !== `[${group}]`) ?? [];
          property[key]?.push(...groups[group] as string[]);
        }
      }
    }
  }
}
