import { z } from 'zod';

import { mailSchema } from './Mail.js';

export const configSchema = z.object({
  admins: z.array(z.string()),
  applicationID: z.string(),
  ASF: z.string(),
  ASFLogChannels: z.array(z.string()),
  ASFPassword: z.string(),
  ASFPermissions: z.record(z.string(), z.array(z.string())),
  mails: z.array(mailSchema),
  token: z.string(),
});

export type Config = z.infer<typeof configSchema>;
