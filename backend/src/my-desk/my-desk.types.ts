import { z } from 'zod';

export const BLOG_LIMITS = {
  TITLE: { MIN: 5, MAX: 100 },
  CONTENT: { MIN: 10, MAX: 10000 },
} as const;

export const GetMyBlogsSchema = z.object({
  cursor: z.object({ id: z.string() }).optional(),
  take: z.number().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  isDeleted: z.boolean().optional().default(false),
});

export type GetMyBlogsInput = z.infer<typeof GetMyBlogsSchema>;

export const UpdateMyBlogSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(BLOG_LIMITS.TITLE.MIN).max(BLOG_LIMITS.TITLE.MAX).optional(),
  content: z.string().min(BLOG_LIMITS.CONTENT.MIN).max(BLOG_LIMITS.CONTENT.MAX).optional(),
  isDeleted: z.boolean().optional(),
});

export type UpdateMyBlogInput = z.infer<typeof UpdateMyBlogSchema>;

export const CreateMyBlogSchema = z.object({
  title: z.string().min(BLOG_LIMITS.TITLE.MIN).max(BLOG_LIMITS.TITLE.MAX),
  content: z.string().min(BLOG_LIMITS.CONTENT.MIN).max(BLOG_LIMITS.CONTENT.MAX),
});

export type CreateMyBlogInput = z.infer<typeof CreateMyBlogSchema>;
