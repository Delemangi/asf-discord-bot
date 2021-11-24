import {Client, Collection, Intents} from 'discord.js';
import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import {readdirSync} from 'fs';
import {config} from './config';

const client: Client = new Client({intents: [Intents.FLAGS.GUILDS]});
const files: string[] = readdirSync('./dist/commands').filter(f => f.endsWith('.js'));
const botCommands: Collection<any, any> = new Collection();
const commandsToDeploy: any[] = [];

for (const file of files) {
    const command = require(`./commands/${file}`);
    botCommands.set(command.data.name, command);
    commandsToDeploy.push(command.data.toJSON());
}

const rest = new REST({version: '9'}).setToken(config.token);
for (const guild of config.guildIDs) {
    rest.put(Routes.applicationGuildCommands(config.clientID, guild), {body: commandsToDeploy})
        .then(() => console.log(`Successfully deployed commands in ${guild}.`))
        .catch(console.error);
}

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }

    const command: any = botCommands.get(interaction.commandName);
    if (!command) {
        return;
    }

    try {
        await command.execute(interaction);
        console.log(`${interaction.user.id} [${interaction.user.username}#${interaction.user.discriminator}]: ${interaction.command?.toJSON}`);
    } catch (e) {
        console.error(e);
        await interaction.reply({content: 'An error occurred.', ephemeral: false});
    }
});

client.once('ready', () => {
    const guilds = client.guilds.cache.map(guild => `${guild.id}\t-\t${guild.name}`);

    console.log(`Servers:`);
    for (const guild of guilds) {
        console.log(guild);
    }
    console.log();
});

client.login(config.token);