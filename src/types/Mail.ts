import { z } from 'zod';

export const mailSchema = z.object({
  folder: z.string(),
  host: z.string(),
  password: z.string(),
  user: z.string(),
});

export type Mail = z.infer<typeof mailSchema>;
