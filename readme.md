# HECKGAMING Discord Bot

Discord bot for [ArchiSteamFarm](https://github.com/JustArchiNET/ArchiSteamFarm), powered by [discord.js](https://github.com/discordjs/discord.js) 14. Requires Node.js ≥ 18 and MariaDB.

It's recommended, but not required to run this inside a Docker container.

## Installation

### Installation (Docker)

1. Clone the repository: `git@github.com:Delemangi/heckgaming-discord-bot.git`
2. Build the images: `docker compose build`

### Installation (Normal)

1. Clone the repository: `git@github.com:Delemangi/heckgaming-discord-bot.git`
2. Install the dependencies: `npm i`

## Running

### Running (Docker)

`docker compose up`

### Running (Normal)

`npm run start`

## Configuration

Create a `config` folder with:

1. `config.json` for the basic configuration
2. `groups.json` for the groups of accounts

Example for `config.json`:

```json
{
  "applicationID": "",
  "ASFAPI": "",
  "ASFChannels": [],
  "ASFLogChannels": [],
  "ASFPassword": "",
  "ASFPermissions": {},
  "ASFWS": "",
  "database": {
    "host": "",
    "password": "",
    "user": ""
  },
  "devMode": false,
  "guilds": [],
  "logLevel": "info",
  "mailInterval": 15,
  "mails": [],
  "permissions": {},
  "reminderInterval": 10_000,
  "roles": {},
  "token": ""
}
```
