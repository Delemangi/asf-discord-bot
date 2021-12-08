import {connect, ImapSimple, ImapSimpleOptions, Message} from '@klenty/imap';
import {logger} from './logger';
import {config} from '../config';

const guardCodeString: string = 'Login Code';
const confirmationString: string = 'confirm the trade contents:';

export async function get2FAFromMail(account: string): Promise<string> {
    for (const mail of config.mails) {
        logger.debug(`Attempting to login to ${mail.user} at ${mail.host} for ${account} Steam Guard`);

        const login: ImapSimpleOptions = {imap: mail};
        const session: ImapSimple = await connect(login);

        session.on('error', (error) => {
            logger.error(`Encountered IMAP error while getting Steam Guard code: ${error}`);
        });

        await session.openBox(mail.folder);

        const now: Date = new Date(Date.now());
        const criteria: string[][] = [['SINCE', now.toISOString()], ['TEXT', account], ['TEXT', guardCodeString]];
        const fetch: { [index: string]: any } = {bodies: ['TEXT']}
        const messages: Message[] = await session.search(criteria, fetch);

        messages.reverse();
        for (const message of messages) {
            const timestamp: Date = new Date(message.attributes.date);
            if (now.getTime() - timestamp.getTime() > config.mailInterval * 60 * 1000) {
                logger.debug(`Reached mail received at ${message.attributes.date} which exceeds the interval`);
                break;
            }

            const code: string | null = find2FAInMail(message.parts[0].body);
            if (code) {
                logger.debug('Found the correct Steam Guard mail');
                return `<${account}> Guard Code: ${code}`;
            }
        }
    }

    return `<${account}> Guard Code: -`;
}

export async function getConfirmationFromMail(account: string): Promise<string> {
    const urls: string[] = [];

    for (const mail of config.mails) {
        logger.debug(`Attempting to login to ${mail.user} at ${mail.host} for ${account} confirmations`);

        const login: ImapSimpleOptions = {imap: mail};
        const session: ImapSimple = await connect(login);

        session.on('error', (error) => {
            logger.error(`Encountered IMAP error while getting confirmations: ${error}`);
        });

        await session.openBox(mail.folder);

        const now: Date = new Date(Date.now());
        const criteria: string[][] = [['SINCE', now.toISOString()], ['TEXT', account], ['TEXT', confirmationString]];
        const fetch: { [index: string]: any } = {bodies: ['TEXT']}
        const messages: Message[] = await session.search(criteria, fetch);

        messages.reverse();
        for (const message of messages) {
            const timestamp: Date = new Date(message.attributes.date);
            if (now.getTime() - timestamp.getTime() > config.mailInterval * 60 * 1000) {
                logger.debug(`Reached mail received at ${message.attributes.date} which exceeds the interval`);
                break;
            }

            const url: string | null = findConfirmationInMail(message.parts[0].body);
            if (url) {
                logger.debug('Found a confirmation mail')
                urls.push(url);
            }
        }
    }

    if (urls.length) {
        return `<${account}> Confirmations: \n ${urls.join('\n')}`;
    } else {
        return `<${account}> Confirmations: -`;
    }
}

function find2FAInMail(text: string): string | null {
    text = text.replace(/\n/g, ' ').replace(/\r/g, '');
    const index: number = text.indexOf(`${guardCodeString}`);

    if (index === -1) {
        return null;
    }

    return text.slice(index + guardCodeString.length + 1, index + guardCodeString.length + 6);
}

function findConfirmationInMail(text: string): string | null {
    const index: number = text.indexOf(confirmationString);

    if (index === -1) {
        return null;
    }

    const URLIndex: number = index + text.slice(index).indexOf('\n');

    if (URLIndex === -1) {
        return null;
    }

    return text.slice(URLIndex, URLIndex + text.slice(URLIndex).indexOf('\n'));
}
