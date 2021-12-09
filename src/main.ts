import {Client, Collection, Intents} from 'discord.js';
import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import {readdirSync} from 'fs';
import {replyToInteraction} from './utils/printing';
import {logger} from './utils/logger';
import {startWS} from "./utils/ws";
import {config} from './config';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const client: Client = new Client({intents: [Intents.FLAGS.GUILDS]});
const files: string[] = readdirSync('./dist/commands').filter((file) => file.endsWith('.js'));
const botCommands: Collection<string, NodeJS.Require> = new Collection();
const commandsToDeploy: string[] = [];

for (const file of files) {
    const command = require(`./commands/${file}`);
    botCommands.set(command.data.name, command);
    commandsToDeploy.push(command.data.toJSON());

    logger.debug(`Command: ${command.data.name}`);
}

const rest: REST = new REST({version: '9'}).setToken(config.token);
for (const guild of config.guildIDs) {
    rest.put(Routes.applicationGuildCommands(config.clientID, guild), {body: commandsToDeploy})
        .then(() => logger.debug(`Successfully deployed commands in ${guild}`))
        .catch((error) => logger.error(`Failed to deploy commands in ${guild}: ${error}`));
}

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        const command: any = botCommands.get(interaction.commandName);

        if (!command) {
            return;
        }

        logger.info(`${interaction.user.tag}: ${interaction.toString()}`);

        try {
            await command.execute(interaction);
        } catch (error) {
            await replyToInteraction(interaction, `Encountered an error: ${error}`);
            logger.error(`Encountered an error while processing the interaction ${interaction}: ${error}`);
        }
    }
});

client.once('ready', () => {
    client.user?.setActivity('World Domination');

    const guilds: string[] = client.guilds.cache.map((guild) => `${guild.id} - ${guild.name}`);

    logger.info('Servers:');
    for (const guild of guilds) {
        logger.info(guild);
    }

    startWS(client)
        .then(() => logger.debug('Successfully established WS connection'))
        .catch((error) => logger.error(`Failed to establish WS connection: ${error}`));
});

export function ping() {
    return client.ws.ping;
}

client.login(config.token);
