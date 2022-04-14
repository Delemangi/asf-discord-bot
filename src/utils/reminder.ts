import {parseDate} from 'chrono-node';
import type {CommandInteraction} from 'discord.js';
import {remindUser} from '../main';
import {configuration} from './config';
import {logger} from './logger';
import {pool} from './sql';

export async function saveReminder (interaction: CommandInteraction): Promise<void> {
  const author: string = interaction.user.id;
  const channel: string = interaction.channel?.id ?? '';
  const message: string = interaction.options.getString('message') ?? 'Reminder';
  const time: string = interaction.options.getString('time') ?? '';

  const date: Date = parseDate(time);

  if (!date) {
    interaction.reply('Unrecognized date format.');
    return;
  }

  pool.getConnection((error, connection) => {
    if (error) {
      logger.error(`Failed to obtain a database connection\n${error}`);
      connection.release();
      return;
    }

    const query: string = `INSERT INTO discord_bot.reminders VALUES ('${author}', '${channel}', '${message}', ?)`;

    connection.query(query, [date], (error_) => {
      if (error_) {
        logger.error(`Failed to add a reminder\n${error_}`);
        connection.release();
        return;
      }

      logger.debug(`Added a reminder by ${interaction.user.tag} for ${message} at ${date}`);

      connection.release();
    });
  });

  interaction.reply(`Reminder set for <t:${date.getTime() / 1_000}:F>.`);
}

export async function loadReminders (): Promise<void> {
  setTimeout(loadReminders, configuration('reminderInterval'));

  pool.getConnection((error, connection) => {
    if (error) {
      logger.error(`Failed to obtain a database connection\n${error}`);
      connection.release();
      return;
    }

    connection.query('SELECT * FROM discord_bot.reminders WHERE timestamp < ?', [new Date()], async (error_, results) => {
      if (error_) {
        logger.error(`Failed to query reminders\n${error_}`);
        connection.release();
        return;
      }

      logger.debug(`Obtained ${results.length} reminders from the database`);

      for (const {author, channel, message} of results) {
        try {
          await remindUser(channel, message, author);
        } catch (error__) {
          logger.error(`Failed to send reminders\n${error__}`);
          connection.release();
          return;
        }
      }

      connection.query('DELETE FROM discord_bot.reminders WHERE timestamp < ?', [new Date()], (error__, results_) => {
        if (error__) {
          logger.error('Failed to delete reminders');
          connection.release();
          return;
        }

        logger.debug(`Deleted ${results_.affectedRows} past reminders`);

        connection.release();
      });
    });
  });
}
