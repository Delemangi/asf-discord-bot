import axios from 'axios';
import {logger} from './logger';
import {strings} from './strings';
import {config} from '../config';

const cache: { [index: string]: { timestamp: number, rate: number } } = {};

export async function convertCurrencies(amount: number, from: string, to: string = 'EUR', digits: number = 2): Promise<string> {
    const key: string = `${from}-${to}`;

    if (cache.hasOwnProperty(key) && Date.now() - cache[key].timestamp < 60 * 60 * 1000) {
        return `${amount} ${from} = ${parseFloat(String(amount * cache[key].rate)).toFixed(digits)} ${to.toUpperCase()}`;
    }

    return axios({
        method: 'get',
        url: `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&symbol=MSFT&apikey=${config.alphaVantageAPI}&from_currency=${from}&to_currency=${to}`
    })
        .then((response) => {
            logger.debug('AlphaVantage responded to the request');

            if (response.data.hasOwnProperty('Realtime Currency Exchange Rate')) {
                const rate: number = parseInt(response.data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
                const timestamp: number = Date.now();

                cache[key] = {rate: rate, timestamp: timestamp};

                return `${amount} ${from} = ${parseFloat(String(amount * cache[key].rate)).toFixed(digits)} ${to.toUpperCase()}`;
            } else if (response.data.hasOwnProperty('Note')) {
                return 'Rate limited.';
            } else if (response.data.hasOwnProperty('Error Message')) {
                return 'One or more of the currencies are unsupported.';
            } else {
                return strings.malformedResponse;
            }
        })
        .catch(error => {
            if (error.response) {
                logger.error(error.response.data);
                logger.error(error.response.status);
                logger.error(error.response.headers);

                return strings.badResponse;
            } else if (error.request) {
                logger.error(error.request);

                return strings.requestFailed;
            } else {
                logger.error(error.message);
                logger.error(error.response.data);
                1
                return strings.unknownError;
            }
        });
}
