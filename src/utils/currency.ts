import axios from 'axios';
import {configuration} from './config';
import {logger} from './logger';
import {strings} from './strings';

const cache: { [index: string]: { timestamp: number, rate: number } } = {};
const HOUR: number = 60 * 60 * 1_000;

export async function convertCurrencies (amount: number, from: string, to: string = 'EUR', digits: number = 2): Promise<string> {
  logger.debug(`Processing the currency conversion request: ${amount} ${from} to ${to}, ${digits} digits`);

  [from, to] = [from.toUpperCase(), to.toUpperCase()];
  const key: string = `${from}-${to}`;

  if (cache[key] && Date.now() - cache[key].timestamp < HOUR) {
    return `${amount} ${from} = ${(amount * cache[key].rate).toFixed(digits)} ${to.toUpperCase()}`;
  }

  return axios({
    method: 'get',
    url: `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${from}&to_currency=${to}&apikey=${configuration('alphaVantageAPI')}`
  })
    .then((response) => {
      logger.debug('The AlphaVantage request succeeded');

      if (response.data['Realtime Currency Exchange Rate']) {
        const rate: number = Number.parseFloat(response.data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
        const timestamp: number = Date.now();

        cache[key] = {
          rate,
          timestamp
        };

        return `${amount} ${from} = ${(amount * cache[key].rate).toFixed(digits)} ${to.toUpperCase()}`;
      }

      if (response.data.Note) {
        logger.debug('We are being rate limited on AlphaVantage');
        return 'Rate limited. Please try again later.';
      }

      if (response.data['Error Message']) {
        logger.debug('We have sent a request with one or more unsupported currencies');
        return 'One or more of the currencies are unsupported.';
      }

      return strings.malformedResponse;
    })
    .catch((error) => {
      if (error.response) {
        logger.error(`The AlphaVantage request failed\n${error.response.data}\n${error.response.status}\n${error.response.headers}`);
        return strings.badResponse;
      }

      if (error.request) {
        logger.error(`The AlphaVantage request failed\n${error.request}`);
        return strings.requestFailed;
      }

      logger.error(`The AlphaVantage request failed\n${error.message}\n${error.response.data}`);
      return strings.unknownError;
    });
}
