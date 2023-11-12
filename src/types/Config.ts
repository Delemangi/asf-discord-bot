import { type Mail } from "./Mail.js";

export type Config = {
  ASF: string;
  ASFLogChannels: string[];
  ASFPassword: string;
  ASFPermissions: { [index: string]: string[] };
  admins: string[];
  applicationID: string;
  mails: Mail[];
  token: string;
};
