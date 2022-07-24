declare global {
  type Command = {
    data: {
      name: string;
      toJSON: () => string;
    };
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  };

  type Config = {
    ASFAPI: string;
    ASFChannels: string[];
    ASFLogChannels: string[];
    ASFPassword: string;
    ASFPermissions: {[index: string]: string[]};
    ASFWS: string;
    applicationID: string;
    database: Database;
    devMode: boolean;
    guilds: string[];
    logLevel: string;
    mailInterval: number;
    mails: Mail[];
    permissions: {[index: string]: string[]};
    reminderInterval: number;
    roles: {[index: string]: string[]};
    token: string;
  };

  type Mail = {
    folder: string;
    host: string;
    password: string;
    user: string;
  };

  type Database = {
    host: string;
    password: string;
    user: string;
  };

  type Strings = {
    emptyMessage: string;
    error: string;
    invalidChannel: string;
    noBotPermission: string;
    noCommandPermission: string;
    tooManyArguments: string;
  };

  type Descriptions = {
    '2fa': string;
    '2fano': string;
    '2faok': string;
    addlicense: string;
    asf: string;
    asfpermissions: string;
    balance: string;
    code: string;
    convert: string;
    farm: string;
    invite: string;
    level: string;
    load: string;
    market: string;
    nickname: string;
    oa: string;
    permissions: string;
    ping: string;
    play: string;
    points: string;
    privacy: string;
    redeem: string;
    reminder: string;
    reset: string;
    resume: string;
    roles: string;
    sa: string;
    setvar: string;
    start: string;
    status: string;
    stop: string;
    transfer: string;
    unpack: string;
  };
}

export {};
