import { configuration } from "./config.js";
import { logger } from "./logger.js";
import { printLog } from "./printing.js";
import { setTimeout as setTimeoutPromise } from "node:timers/promises";
import { WebSocket } from "ws";

const endpoint = "/api/nlog";
let buffer: string[] = [];

export const initializeWS = () => {
  const headers = {
    Authentication: configuration("ASFPassword"),
    "Content-Type": "application/json",
  };
  const ws = new WebSocket("ws://" + configuration("ASF") + endpoint, {
    headers,
  });

  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  ws.on("message", (data) => buffer.push(JSON.parse(data.toString()).Result));
  ws.on("error", (error) =>
    logger.error(`Encountered WS error\n${JSON.stringify(error)}`),
  );
  ws.on("close", (code) => {
    logger.error(`The WS connection was closed\n${code}`);

    setTimeout(initializeWS, 10_000);
  });
};

export const sendASFLogs = async () => {
  while (true) {
    const logs = buffer.join("\n");
    buffer = [];

    if (logs.length > 0) {
      for (const channel of configuration("ASFLogChannels")) {
        try {
          await printLog(channel, logs);
        } catch (error) {
          logger.error(
            `Failed to print ASF log to channel ${channel}\n${error}`,
          );
        }
      }
    }

    await setTimeoutPromise(5_000);
  }
};
