import { z } from 'zod';

export const getRegistrationOptionsSchema = z.object({
  handle: z.string().min(1, 'Handle is required'),
});

export const verifyRegistrationSchema = z.object({
  handle: z.string().min(1, 'Handle is required'),
  response: z.any(), // RegistrationResponseJSON
});
