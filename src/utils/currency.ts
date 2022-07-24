import {type ChatInputCommandInteraction} from 'discord.js';
import {logger} from './logger.js';
import {getString} from './strings.js';

const cache: {[index: string]: {rate: number; timestamp: number}} = {};
const INTERVAL = 12 * 60 * 60 * 1_000;

export async function convertCurrencies (interaction: ChatInputCommandInteraction, amount: number, from: string, to: string = 'EUR', digits: number = 2): Promise<string> {
  const [fromUpper, toUpper] = [from.toUpperCase(), to.toUpperCase()];
  const [fromLower, toLower] = [from.toLowerCase(), to.toLowerCase()];

  logger.debug(`Executing the currency conversion request ${amount} ${fromUpper} to ${toUpper}, ${digits} digits from interaction ${interaction.id}`);

  const key = `${fromUpper}-${toUpper}`;
  const object = cache[key];

  if (object !== undefined && Date.now() - object.timestamp < INTERVAL) {
    logger.debug(`Returning the cached converion rate for currency conversion request ${amount} ${fromUpper} to ${toUpper}, ${digits} digits from interaction ${interaction.id}`);

    return formatCurrencies(amount, fromUpper, toUpper, object.rate, digits);
  }

  logger.debug(`The conversion rate for currency conversion request ${amount} ${fromUpper} to ${toUpper}, ${digits} digits from interaction ${interaction.id} was not found in the cache`);

  const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${fromLower}/${toLower}.min.json`;
  const result = await fetch(url);

  if (!result.ok) {
    logger.error(`The currency conversion request ${amount} ${fromUpper} to ${toUpper}, ${digits} digits from interaction ${interaction.id} failed: ${result.status} ${result.statusText}`);

    return getString('error');
  }

  logger.debug(`The currency conversion request ${amount} ${fromUpper} to ${toUpper}, ${digits} digits from interaction ${interaction.id} succeeded: ${result.status} ${result.statusText}`);

  const json: {[index: string]: string} = await result.json();
  const exchangeRate = json[toLower];

  if (exchangeRate === undefined) {
    logger.error(`The currency conversion request ${amount} ${fromUpper} to ${toUpper}, ${digits} digits from interaction ${interaction.id} returned an invalid response`);

    return getString('error');
  }

  const rate = Number.parseFloat(exchangeRate);
  const timestamp = Date.now();

  logger.debug(`Caching and returning the newly obtained currency conversion rate for currency conversion request ${amount} ${fromUpper} to ${toUpper}, ${digits} digits from interaction ${interaction.id}`);

  Object.assign(cache, {
    [key]: {
      rate,
      timestamp
    }
  });

  return formatCurrencies(amount, fromUpper, toUpper, rate, digits);
}

function formatCurrencies (amount: number, from: string, to: string, rate: number, digits: number): string {
  return `${amount} ${from} = ${(amount * rate).toFixed(digits)} ${to}`;
}
