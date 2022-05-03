declare global {
  type Command = {
    data: {
      name: string;
      toJSON: () => string;
    };
    execute: (interaction: CommandInteraction) => Promise<void>;
  };

  type Config = {[index: string]: string[] | number | string | {[index: string]: ConnectionOptions | boolean | number | string} | {[index: string]: string[]} | {[index: string]: string}};

  type ConfigProperty = string[] | number | string | {[index: string]: ConnectionOptions | boolean | number | string} | {[index: string]: string[]} | {[index: string]: string};

  type Mail = {
    authTimeout: number;
    folder: string;
    host: string;
    password: string;
    port: number;
    tls: boolean;
    tlsOptions: ConnectionOptions;
    user: string;
  };

  type FullConfig = {
    ASFAPI: string;
    ASFChannels: string[];
    ASFLogChannels: string[];
    ASFPassword: string;
    ASFPermissions: {[index: string]: string[]};
    ASFWS: string;
    AlphaVantagePassword: string;
    clientID: string;
    database: {
      host: string;
      password: string;
      user: string;
    };
    guildIDs: string[];
    logLevel: string;
    mailInterval: number;
    mails: [
      {
        authTimeout: number;
        folder: string;
        host: string;
        password: string;
        port: number;
        tls: boolean;
        tlsOptions: ConnectionOptions;
        user: string;
      }
    ];
    permissions: {[index: string]: string[]};
    reminderInterval: number;
    roles: {[index: string]: string[]};
    token: string;
  };
}

export {};
