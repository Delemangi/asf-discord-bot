exports.config = {
  alphaVantageAPI: '',
  asfAPI: 'http://localhost:1242/api/command',
  asfChannels: [],
  asfLogChannels: [],
  asfPassword: '',
  asfPermissions: {},
  asfWS: 'ws://localhost:1242/api/nlog',
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
  reminderInterval: 10_000,
  token: ''
};
