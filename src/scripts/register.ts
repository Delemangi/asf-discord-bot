import { REST, Routes } from 'discord.js';

import { getCommands } from '../utils/commands.js';
import { configuration } from '../utils/config.js';
import { logger } from '../utils/logger.js';

const rest = new REST().setToken(configuration('token'));
const commands = [];

const registeredCommands = await getCommands();

for (const [, command] of registeredCommands) {
  commands.push(command.data.toJSON());
}

try {
  await rest.put(Routes.applicationCommands(configuration('applicationID')), {
    body: commands,
  });
  logger.info('Done');
} catch (error) {
  throw new Error('Failed to register application commands', { cause: error });
}
