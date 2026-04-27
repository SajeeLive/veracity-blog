import { z } from 'zod';

export const GetMyBlogsSchema = z.object({
  cursor: z.object({ id: z.string() }).optional(),
  take: z.number().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  isDeleted: z.boolean().optional().default(false),
});

export type GetMyBlogsInput = z.infer<typeof GetMyBlogsSchema>;

export const UpdateMyBlogSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(5).max(100).optional(),
  content: z.string().min(10).max(10000).optional(),
  isDeleted: z.boolean().optional(),
});

export type UpdateMyBlogInput = z.infer<typeof UpdateMyBlogSchema>;

export const CreateMyBlogSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(10).max(10000),
});

export type CreateMyBlogInput = z.infer<typeof CreateMyBlogSchema>;
