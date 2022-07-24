import {connect} from '@klenty/imap';
import {configuration} from './config.js';
import {logger} from './logger.js';

const guardCodeString = 'Login Code';
const confirmationString = 'confirm the trade contents:';

const settings = {
  authTimeout: 10_000,
  port: 993,
  tls: true,
  tlsOptions: {
    rejectUnauthorized: false
  }
};

export async function getGuardCodeFromMail (account: string): Promise<string> {
  for (const mailConfig of configuration('mails')) {
    logger.debug(`Logging in to ${mailConfig.user} at ${mailConfig.host} for account ${account} Steam Guard`);

    const imap = {
      ...settings,
      ...mailConfig
    };

    const session = await connect({imap});

    session.on('error', (error) => logger.error(`Encountered IMAP error while getting Steam Guard code for account ${account}: ${error}`));

    await session.openBox(imap.folder);

    const now = new Date();
    const criteria = [['SINCE', now.toISOString()], ['TEXT', account], ['TEXT', guardCodeString]];
    const fetch = {bodies: ['TEXT']};
    const messages = await session.search(criteria, fetch);

    messages.reverse();
    for (const message of messages) {
      const timestamp = new Date(message.attributes.date);

      if (now.getTime() - timestamp.getTime() > configuration('mailInterval') * 60 * 1_000) {
        logger.debug(`Reached mail received at ${message.attributes.date} which exceeds the interval for account ${account}`);

        break;
      }

      const code = findGuardCodeInMail(message.parts[0]?.body);

      if (code) {
        logger.debug(`Found the Steam Guard mail for account ${account}`);

        return `<${account}> Guard Code: ${code}`;
      }
    }
  }

  logger.debug(`Failed to find the Steam Guard mail for account ${account}`);

  return `<${account}> Guard Code: -`;
}

export async function getConfirmationFromMail (account: string): Promise<string> {
  const urls: string[] = [];

  for (const mailConfig of configuration('mails')) {
    logger.debug(`Logging in to ${mailConfig.user} at ${mailConfig.host} for account ${account} confirmations`);

    const imap = {
      ...settings,
      ...mailConfig
    };

    const session = await connect({imap});

    session.on('error', (error) => {
      logger.error(`Encountered IMAP error while getting confirmations for account ${account}: ${error}`);
    });

    await session.openBox(imap.folder);

    const now = new Date();
    const criteria = [['SINCE', now.toISOString()], ['TEXT', account], ['TEXT', confirmationString]];
    const fetch = {bodies: ['TEXT']};
    const messages = await session.search(criteria, fetch);

    messages.reverse();

    for (const message of messages) {
      const timestamp = new Date(message.attributes.date);

      if (now.getTime() - timestamp.getTime() > configuration('mailInterval') * 60 * 1_000) {
        logger.debug(`Reached mail received at ${message.attributes.date} which exceeds the interval for account ${account}`);

        break;
      }

      const url = findConfirmationInMail(message.parts[0]?.body);

      if (url) {
        logger.debug(`Found a confirmation mail for account ${account}`);

        urls.push(url);
      }
    }
  }

  if (urls.length > 0) {
    logger.debug(`Found confirmations for account ${account}`);

    return `<${account}> Confirmations: \n${urls.join('\n')}`;
  }

  logger.debug(`Failed to find confirmations for account ${account}`);

  return `<${account}> Confirmations: -`;
}

function findGuardCodeInMail (textContent: string): string | null {
  const text = textContent.replace(/[\n\r]/gu, ' ');
  const index = text.indexOf(`${guardCodeString}`);

  if (index === -1) {
    return null;
  }

  return text.slice(index + guardCodeString.length + 1, index + guardCodeString.length + 6);
}

function findConfirmationInMail (text: string): string | null {
  const index = text.indexOf(confirmationString);

  if (index === -1) {
    return null;
  }

  const URLIndex = index + text.slice(index).indexOf('\n');

  if (URLIndex === -1) {
    return null;
  }

  return text.slice(URLIndex, URLIndex + text.slice(URLIndex).indexOf('\n'));
}
