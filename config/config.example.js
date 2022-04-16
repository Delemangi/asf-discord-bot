module.exports = {
  alphaVantageAPI: '',
  ASFAPI: 'http://localhost:1242/api/command',
  ASFChannels: [],
  ASFLogChannels: [],
  ASFPassword: '',
  ASFPermissions: {},
  ASFWS: 'ws://localhost:1242/api/nlog',
  clientID: '',
  database: {
    host: 'localhost',
    password: '',
    user: 'root'
  },
  guildIDs: [],
  logLevel: 'debug',
  mailInterval: 15,
  mails: [
    {
      authTimeout: 10_000,
      folder: 'Inbox',
      host: '',
      password: '',
      port: 993,
      tls: true,
      tlsOptions: {rejectUnauthorized: false},
      user: ''
    }
  ],
  permissions: [],
  reminderInterval: 10_000,
  roles: {},
  token: ''
};
