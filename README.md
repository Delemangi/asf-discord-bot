# ArchiSteamFarm Discord Bot

Discord bot for [ArchiSteamFarm](https://github.com/JustArchiNET/ArchiSteamFarm), powered by [discord.js](https://github.com/discordjs/discord.js) 14. Requires Node.js ≥ 20.

This bot is intended to be ran alongside ArchiSteamFarm, and will allow the user to manage ASF from Discord.

It's recommended, but not required to run this inside a Docker container.

## Installation

### Installation (Docker)

1. Clone the repository: `git@github.com:Delemangi/asf-discord-bot.git`
2. Build the images: `docker compose build`

### Installation (Normal)

1. Clone the repository: `git@github.com:Delemangi/asf-discord-bot.git`
2. Install the dependencies: `npm i`

## Running

### Running (Docker)

`docker compose up`

### Running (Normal)

`npm run start`

### Note

If it's your first run of the bot, or if you have just updated the bot, you should also run `npm run command:register` to register the application commands. Conversely, `npm run command:unregister` exists to remove all commands.

## Configuration

Create a `config` folder with:

1. `config.json` for the basic configuration of the Discord bot and ASF
2. `groups.json` for the groups of accounts on ASF

### `config.json`

Example for `config.json`:

```json
{
  "ASF": "",
  "ASFLogChannels": [],
  "ASFPassword": "",
  "ASFPermissions": {},
  "admins": [],
  "applicationID": "",
  "mails": [],
  "token": "",
}
```

The minimum required config properties for `config.json` are:

- `token` (the Discord bot's token)
- `applicationID` (the Discord bot's application ID, for registering the application commands)
- `ASF` (where ASF is located, in case of Docker setup, this should probably be `asf:1242`)

It's also highly recommended to set a password for ASF, especially if you are running it outside a Docker container.

The `ASFLogChannels` property should be a list of IDs of channels where the bot should send the ASF log.

The `ASFPermissions` property should be an object whose keys are user IDs and values are lists of accounts or groups of accounts. See `groups.json` for more information.

The `mails` property is used for obtaining Steam Guard codes for accounts that do not have 2FA. There can be multiple. Example:

The `admins` property is a list of IDs of users who will be able to execute important commands.

```json
{
  ...
  "mails": [
    {
      "folder": "Inbox",
      "host": "imap.gmail.com",
      "password": "password12345",
      "user": "example@gmail.com"
    }
  ]
}
```

### `groups.json`

Example for `groups.json`:

```json
{
  "csgo": [
    "account1",
    "account2",
    "account3"
  ],
  "rust": [
    "account4",
    "account5",
    "account6"
  ]
}
```

With above example configuration for `groups.json`, these groups can be used instead of listing all accounts in `config.json`. For example:

```json
{
  ...
  "ASFPermissions": {
    "user_id": [
      "account7",
      "account8",
      "[csgo]"
    ]
  }
}
```

In this example, the user would have access to the accounts `account7`, `account8`, and all accounts under the group `csgo`.

## Communication with ASF

Please note that you may have to create an IPC config to be able to access ASF. Example `IPC.config`:

```json
{
    "Kestrel":
    {
        "Endpoints":
        {
            "http":
            {
                "Url": "http://*:1242"
            }
        }
    },
    "PathBase": "/"
}
```

In addition, make sure that the password in the ASF config and in the bot config are matching.
