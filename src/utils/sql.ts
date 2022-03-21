import {
  createPool,
  Pool
} from 'mysql';
import {config} from '../config';
import {logger} from './logger';

const reminderQuery: string = 'CREATE TABLE IF NOT EXISTS discord_bot.reminders (author VARCHAR(50) NOT NULL, channel VARCHAR(50) NOT NULL, message TEXT NOT NULL, timestamp DATETIME NOT NULL);';
const databaseQuery: string = 'CREATE DATABASE IF NOT EXISTS discord_bot character set utf8mb4 collate utf8mb4_unicode_ci;';

export const pool: Pool = createPool(config.database);

pool.on('acquire', () => logger.debug('Acquired a database connection'));

pool.on('connection', () => logger.debug('Sucessfully established a database connection'));

export async function loadDB (): Promise<void> {
  pool.getConnection((error, connection) => {
    if (error) {
      logger.error(`Failed to establish the first database connection\n${error}`);
      return;
    }

    connection.query(databaseQuery, (error_) => {
      if (error_) {
        logger.error(`Failed to create database\n${error_}`);
        return;
      }

      logger.debug('Database created');

      connection.release();
    });
  });
}

export async function loadTables (): Promise<void> {
  pool.getConnection((error, connection) => {
    if (error) {
      logger.error(`Failed to establish the second database connection\n${error}`);
      return;
    }

    connection.query(reminderQuery, (error_) => {
      if (error_) {
        logger.error(`Failed to create reminders table\n${error_}`);
        connection.release();
        return;
      }

      logger.debug('Reminders table created');

      connection.release();
    });
  });
}
