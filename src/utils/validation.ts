import { configuration } from "./config.js";
import { logger } from "./logger.js";

export const validate = () => {
  const token = configuration("token");
  const applicationID = configuration("applicationID");
  const ASF = configuration("ASF");
  const ASFPassword = configuration("ASFPassword");

  if (token === "" || applicationID === "") {
    throw new Error(
      "The bot token or application ID have not been set. Please set them and restart the bot.",
    );
  }

  if (ASF === "") {
    throw new Error(
      "The ASF API or WS URLs have not been set. Please set them and restart the bot.",
    );
  }

  if (ASFPassword === "") {
    logger.warn(
      "You have not set an ASF password. It is highly recommended to do so for security reasons.",
    );
  }
};
