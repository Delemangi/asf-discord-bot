import {setTimeout} from 'node:timers/promises';
import {time} from '@discordjs/builders';
import {parseDate} from 'chrono-node';
import {type RowDataPacket} from 'mysql2/promise';
import {remindUser} from './client.js';
import {configuration} from './config.js';
import {logger} from './logger.js';
import {pool} from './sql.js';

export async function saveReminder (timestamp: string, reminder: string, author: string, channel: string): Promise<string> {
  logger.debug(`Saving a reminder by ${author} for ${timestamp} with message ${reminder}`);

  const queryString = `INSERT INTO discord_bot.reminders VALUES ('${author}', '${channel}', '${reminder}', ?)`;
  const date: Date | null = parseDate(timestamp);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!date) {
    logger.debug(`Invalid date provided for reminder: ${timestamp}`);

    return 'Invalid date.';
  }

  try {
    await pool.query(queryString, [date]);
    logger.debug(`Added a reminder by ${author} for ${date} with message ${reminder}`);

    return `Reminder set for ${time(date, 'F')}`;
  } catch (error) {
    logger.error(`Failed to add a reminder\n${error}`);

    return 'Failed to create the reminder.';
  }
}

export async function loadReminders (): Promise<void> {
  const selectQueryString = 'SELECT * FROM discord_bot.reminders WHERE timestamp < ?';
  const deleteQueryString = 'DELETE FROM discord_bot.reminders WHERE timestamp < ?';

  while (true) {
    try {
      const [rows] = await pool.query(selectQueryString, [new Date()]);
      logger.debug('Reminders loaded');

      await pool.query(deleteQueryString, [new Date()]);
      logger.debug('Old reminders deleted');

      if (Array.isArray(rows)) {
        for (const {channel, message, author} of rows as RowDataPacket[]) {
          await remindUser(channel, message, author);
        }
      }
    } catch (error) {
      logger.error(`Failed to load reminders\n${error}`);
    }

    await setTimeout(configuration('reminderInterval') as number);
  }
}
