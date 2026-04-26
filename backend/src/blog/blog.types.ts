import { z } from 'zod';

export const getAllBlogsSchema = z
  .object({
    cursor: z
      .object({
        id: z.uuid(), // Enforcing UUID format for safety
      })
      .optional(),
    take: z.number().min(1).max(100).default(10), // Added a default for better DX
    search: z.string().trim().optional(), // Trims whitespace from user input
  })
  .optional();

export const getBlogByIdSchema = z.object({
  id: z.uuid({ message: 'Invalid blog ID format' }),
});
