import {
  type ChatInputCommandInteraction,
  type ContextMenuCommandBuilder,
  type ContextMenuCommandInteraction,
  type SlashCommandBuilder,
  type SlashCommandSubcommandGroupBuilder,
} from 'discord.js';

declare global {
  type Command = {
    data:
      | ContextMenuCommandBuilder
      | SlashCommandBuilder
      | SlashCommandSubcommandGroupBuilder;
    execute: (
      interaction: ChatInputCommandInteraction | ContextMenuCommandInteraction,
    ) => Promise<void>;
  };

  type Config = {
    ASF: string;
    ASFLogChannels: string[];
    ASFPassword: string;
    ASFPermissions: { [index: string]: string[] };
    admins: string[];
    applicationID: string;
    mails: Mail[];
    token: string;
  };

  type Mail = {
    folder: string;
    host: string;
    password: string;
    user: string;
  };

  type ASFResponse = {
    Message: string;
    Result: string;
    Success: boolean;
  };
}

export {};
