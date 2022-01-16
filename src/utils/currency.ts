import axios from 'axios';
import {config} from '../config';
import {logger} from './logger';
import {strings} from './strings';

const cache: { [index: string]: { timestamp: number, rate: number } } = {};

export async function convertCurrencies (amount: number, from: string, to: string = 'EUR', digits: number = 2): Promise<string> {
  logger.debug(`Processing a currency conversion request: ${amount} ${from} ${to}`);

  const key: string = `${from}-${to}`;

  if (cache[key] && Date.now() - cache[key].timestamp < 60 * 60 * 1_000) {
    return `${amount} ${from} = ${Number.parseFloat(String(amount * cache[key].rate)).toFixed(digits)} ${to.toUpperCase()}`;
  }

  return axios({
    method: 'get',
    url: `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&symbol=MSFT&apikey=${config.alphaVantageAPI}&from_currency=${from}&to_currency=${to}`
  })
    .then((response) => {
      logger.debug('The AlphaVantage request succeeded');

      if (response.data['Realtime Currency Exchange Rate']) {
        const rate: number = Number.parseInt(response.data['Realtime Currency Exchange Rate']['5. Exchange Rate'], 10);
        const timestamp: number = Date.now();

        cache[key] = {
          rate,
          timestamp
        };

        return `${amount} ${from} = ${Number.parseFloat(String(amount * cache[key].rate)).toFixed(digits)} ${to.toUpperCase()}`;
      }

      if (response.data.Note) {
        logger.debug('We are being rate limited');
        return 'Rate limited.';
      }

      if (response.data['Error Message']) {
        logger.debug('We have sent a request with one or more unsupported currencies');
        return 'One or more of the currencies are unsupported.';
      }

      return strings.malformedResponse;
    })
    .catch((error) => {
      if (error.response) {
        logger.error(`The AlphaVantage request failed: ${error.response.data} | ${error.response.status} | ${error.response.headers}`);
        return strings.badResponse;
      }

      if (error.request) {
        logger.error(`The AlphaVantage request failed: ${error.request}`);
        return strings.requestFailed;
      }

      logger.error(`The AlphaVantage request failed: ${error.message} | ${error.response.data}`);
      return strings.unknownError;
    });
}
