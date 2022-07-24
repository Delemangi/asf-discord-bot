import {configuration} from './config.js';
import {logger} from './logger.js';

export function validate () {
  const token = configuration('token');
  const applicationID = configuration('applicationID');
  const ASFAPI = configuration('ASFAPI');
  const ASFWS = configuration('ASFWS');
  const ASFPassword = configuration('ASFPassword');
  const mode = configuration('devMode');
  const guilds = configuration('guilds');

  if (token === '' || applicationID === '') {
    throw new Error('The bot token or application ID have not been set. Please set them and restart the bot.');
  }

  if (ASFAPI === '' || ASFWS === '') {
    throw new Error('The ASF API or WS URLs have not been set. Please set them and restart the bot.');
  }

  if (ASFPassword === '') {
    logger.warn('You have not set an ASF password. It is highly recommended to do so for security reasons.');
  }

  if (mode && guilds.length === 0) {
    logger.warn('You are running the bot in development mode but haven\'t set any guilds. Slash commands won\'t be registered.');
  }

  logger.debug('Validation passed');
}
