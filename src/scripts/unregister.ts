import { REST, Routes } from 'discord.js';

import { configuration } from '../utils/config.js';
import { logger } from '../utils/logger.js';

const rest = new REST().setToken(configuration('token'));

try {
  await rest.put(Routes.applicationCommands(configuration('applicationID')), {
    body: [],
  });
  logger.info('Done');
} catch (error) {
  throw new Error(`Failed to unregister application commands\n${error}`);
}
