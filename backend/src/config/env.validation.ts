import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(8080),
  FRONTEND_URL: z.url(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.coerce.number(),
  DATABASE_NAME: z.string(),

  // Add other vars here as you go
});

export type Env = z.infer<typeof envSchema>;
