import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  FRONTEND_URL: z.string().url(),
  // Add other vars here as you go
});

export type Env = z.infer<typeof envSchema>;