// @ts-ignore
import cfg from '../../config/config';
// @ts-ignore
import defaultConfig from '../../config/default';

let config: {[index: string]: any} = cfg;

export function configuration (property: string): any {
  return config[property] ?? defaultConfig[property];
}

export async function reloadConfig (): Promise<void> {
  delete require.cache[require.resolve('../../config/config')];
  config = require('../../config/config');
}
