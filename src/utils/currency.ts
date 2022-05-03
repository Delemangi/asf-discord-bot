import {configuration} from './config.js';
import {logger} from './logger.js';
import {getString} from './strings.js';

const cache: {[index: string]: {rate: number; timestamp: number}} = {};
const HOUR: number = 60 * 60 * 1_000;

export async function convertCurrencies (amount: number, from: string, to: string = 'EUR', digits: number = 2): Promise<string> {
  const [fromUpper, toUpper] = [from.toUpperCase(), to.toUpperCase()];

  logger.debug(`Processing the currency conversion request: ${amount} ${fromUpper} to ${toUpper}, ${digits} digits`);

  const key = `${fromUpper}-${toUpper}`;
  const object = cache[key];

  if (object !== undefined && Date.now() - object.timestamp < HOUR) {
    return `${amount} ${fromUpper} = ${(amount * object.rate).toFixed(digits)} ${toUpper.toUpperCase()}`;
  }

  const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${configuration('AlphaVantagePassword') as string}`;
  const result: Response = await fetch(url);

  if (!result.ok) {
    logger.error(`The AlphaVantage request failed\n${result.status} ${result.statusText}\n${result.body}`);

    return getString('unknownError');
  }

  logger.debug('The AlphaVantage request succeeded');

  const json = await result.json();
  const newObject = json['Realtime Currency Exchange Rate']['5. Exchange Rate'];

  if (!newObject) {
    logger.error(`The AlphaVantage request returned an invalid response\n${result.body}`);

    return getString('unknownError');
  }

  const rate: number = Number.parseFloat(newObject);
  const timestamp: number = Date.now();

  Object.assign(cache, {[key]: {
    rate,
    timestamp
  }});

  return `${amount} ${from} = ${(amount * rate).toFixed(digits)} ${to.toUpperCase()}`;
}
