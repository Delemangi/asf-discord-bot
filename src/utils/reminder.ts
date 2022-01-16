import type {CommandInteraction} from 'discord.js';
import {logger} from './logger';
import {pool} from './sql';

export function saveReminder (interaction: CommandInteraction): void {
  pool.getConnection((error, connection) => {
    if (error) {
      logger.error('Failed');
      return;
    }

    connection.query('ADD', () => {
      logger.info(interaction);
    });
  });
}
