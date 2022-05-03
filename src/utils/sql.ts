import {
  type Pool,
  createPool
} from 'mysql2/promise';
import {configuration} from './config.js';
import {logger} from './logger.js';

const reminderQuery = 'CREATE TABLE IF NOT EXISTS discord_bot.reminders (author VARCHAR(50) NOT NULL, channel VARCHAR(50) NOT NULL, message TEXT NOT NULL, timestamp DATETIME NOT NULL);';
const databaseQuery = 'CREATE DATABASE IF NOT EXISTS discord_bot character set utf8mb4 collate utf8mb4_unicode_ci;';

export const pool: Pool = createPool(configuration('database') as {});

pool.on('connection', () => logger.debug('Sucessfully established a database connection'));
pool.on('acquire', () => logger.debug('Acquired a database connection'));
pool.on('release', () => logger.debug('Released a database connection'));

export async function initDB (): Promise<void> {
  try {
    await pool.query(databaseQuery);

    logger.debug('Database created');
  } catch (error) {
    logger.error(`Failed to create database\n${JSON.stringify(error)}`);
  }
}

export async function loadTables (): Promise<void> {
  try {
    await pool.query(reminderQuery);

    logger.debug('Reminders table created');
  } catch (error) {
    logger.error(`Failed to create reminders table\n${JSON.stringify(error)}`);
  }
}
