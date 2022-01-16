import {
  createPool,
  Pool
} from 'mysql';
import {config} from '../config';
import {logger} from './logger';

export const pool: Pool = createPool(config.SQL);

pool.on('acquire', () => logger.info('Acquired a database connection'));

pool.on('connection', () => logger.info('Sucessfully established a database connection'));
