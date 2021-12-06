import type {Client} from "discord.js";
import {WebSocket} from "ws";
import {config} from "../config";
import {printLog} from "./printing";

let buffer: string[] = [];

export async function startWS(client: Client): Promise<void> {
    const ws = new WebSocket(config.asfWS, {
        headers: {
            'Authentication': config.asfPassword,
            'Content-Type': 'application/json'
        }
    });

    setInterval(() => sendToWS(client), 5000);

    ws.on('message', async (data) => {
        buffer.push(JSON.parse(data.toString()).Result);
    });
}

async function sendToWS(client: Client): Promise<void> {
    for (const channel of config.asfLogChannels) {
        const textChannel = client.channels.cache.get(channel);

        if (!buffer.length) {
            return;
        }

        if (textChannel) {
            await printLog(textChannel, buffer.join('\n'));
        }
    }

    buffer = [];
}
