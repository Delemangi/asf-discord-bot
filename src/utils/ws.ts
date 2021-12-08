import type {Client} from "discord.js";
import {WebSocket} from "ws";
import {printLog} from "./printing";
import {logger} from "./logger";
import {config} from "../config";

let buffer: string[] = [];

export async function startWS(client: Client): Promise<void> {
    const ws = new WebSocket(config.asfWS, {
        headers: {
            'Authentication': config.asfPassword,
            'Content-Type': 'application/json'
        }
    });

    setInterval(() => sendToWS(client), 5000);

    ws.on('message', (data) => buffer.push(JSON.parse(data.toString()).Result));

    ws.on('close', (code) => {
        logger.error(`The WS connection was closed: ${code}`);
        logger.debug('Attempting to reconnect to WS in 15 seconds...');
        setTimeout(() => startWS(client), 15000);
    });

    ws.on('error', (error) => logger.error(`Encountered WS error: ${error}`));
}

async function sendToWS(client: Client): Promise<void> {
    for (const channel of config.asfLogChannels) {
        const textChannel = client.channels.cache.get(channel);

        if (!buffer.length) {
            return;
        }

        if (textChannel) {
            try {
                await printLog(textChannel, buffer.join('\n'));
            } catch (e) {
                logger.error(`Failed to print ASF log: ${e}`);
                return;
            }
        }
    }

    buffer = [];
}
