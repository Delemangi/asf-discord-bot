import { z } from 'zod';

export const asfResponseSchema = z.object({
  Message: z.string(),
  Result: z.string(),
  Success: z.boolean(),
});

export type AsfResponse = z.infer<typeof asfResponseSchema>;
