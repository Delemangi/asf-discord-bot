import { type Mail } from './Mail.js';

export type Config = {
  admins: string[];
  applicationID: string;
  ASF: string;
  ASFLogChannels: string[];
  ASFPassword: string;
  ASFPermissions: { [index: string]: string[] };
  mails: Mail[];
  token: string;
};
