import { configuration } from "./config.js";
import { logger } from "./logger.js";
import { connect } from "@klenty/imap";

const guardCodeString = "Login Code";
const confirmationString = "confirm the trade contents:";

const settings = {
  authTimeout: 10_000,
  port: 993,
  tls: true,
  tlsOptions: {
    rejectUnauthorized: false,
  },
};

const findGuardCodeInMail = (textContent: string) => {
  const text = textContent.replaceAll(/[\n\r]/gu, " ");
  const index = text.indexOf(`${guardCodeString}`);

  if (index === -1) {
    return null;
  }

  return text.slice(
    index + guardCodeString.length + 2,
    index + guardCodeString.length + 7,
  );
};

const findConfirmationInMail = (text: string) => {
  const index = text.indexOf(confirmationString);

  if (index === -1) {
    return null;
  }

  const URLIndex = index + text.slice(index).indexOf("\n");

  if (URLIndex === -1) {
    return null;
  }

  return text.slice(URLIndex, URLIndex + text.slice(URLIndex).indexOf("\n"));
};

export const getGuardCodeFromMail = async (account: string) => {
  for (const mailConfig of configuration("mails")) {
    const imap = {
      ...settings,
      ...mailConfig,
    };

    const session = await connect({ imap });

    session.on("error", (error) =>
      logger.error(
        `Encountered IMAP error while getting Steam Guard code for account ${account}: ${error}`,
      ),
    );

    await session.openBox(imap.folder);

    const now = new Date();
    const criteria = [
      ["SINCE", now.toISOString()],
      ["TEXT", account],
      ["TEXT", guardCodeString],
    ];
    const fetch = { bodies: ["TEXT"] };
    const messages = await session.search(criteria, fetch);

    messages.reverse();
    for (const message of messages) {
      const timestamp = new Date(message.attributes.date);

      if (now.getTime() - timestamp.getTime() > 15 * 60 * 1_000) {
        break;
      }

      const code = findGuardCodeInMail(message.parts[0]?.body);

      if (code) {
        return `<${account}> Guard Code: ${code}`;
      }
    }
  }

  return `<${account}> Guard Code: -`;
};

export const getConfirmationFromMail = async (account: string) => {
  const urls: string[] = [];

  for (const mailConfig of configuration("mails")) {
    const imap = {
      ...settings,
      ...mailConfig,
    };

    const session = await connect({ imap });

    session.on("error", (error) => {
      logger.error(
        `Encountered IMAP error while getting confirmations for account ${account}: ${error}`,
      );
    });

    await session.openBox(imap.folder);

    const now = new Date();
    const criteria = [
      ["SINCE", now.toISOString()],
      ["TEXT", account],
      ["TEXT", confirmationString],
    ];
    const fetch = { bodies: ["TEXT"] };
    const messages = await session.search(criteria, fetch);

    messages.reverse();

    for (const message of messages) {
      const timestamp = new Date(message.attributes.date);

      if (now.getTime() - timestamp.getTime() > 15 * 60 * 1_000) {
        break;
      }

      const url = findConfirmationInMail(message.parts[0]?.body);

      if (url !== null) {
        urls.push(url);
      }
    }
  }

  if (urls.length > 0) {
    return `<${account}> Confirmations: \n${urls.join("\n")}`;
  }

  return `<${account}> Confirmations: -`;
};
