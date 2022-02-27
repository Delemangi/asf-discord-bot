import {parseDate} from 'chrono-node';
import type {CommandInteraction} from 'discord.js';
import {logger} from './logger';
import {pool} from './sql';

export async function saveReminder (interaction: CommandInteraction): Promise<void> {
  const author: string = interaction.user.id;
  const channel: string = interaction.channel?.id ?? '';
  const message: string = interaction.options.getString('message') ?? 'Reminder';
  const time: string = interaction.options.getString('time') ?? '';

  pool.getConnection((error, connection) => {
    if (error) {
      logger.error(`Failed to obtain a connection\n${error}`);
      return;
    }

    const timestamp = parseDate(time).toISOString().slice(0, 19).replace('T', ' ');

    const query: string = `INSERT INTO discord_bot.reminders VALUES ('${author}', '${channel}', '${message}', '${timestamp}')`;

    connection.query(query, (error_) => {
      if (error_) {
        logger.error(`Failed to register a reminder\n${error_}`);
        return;
      }

      logger.debug('Registered a reminder');
    });
  });

  interaction.reply('Reminder set.');
}

export async function loadReminders () {}
