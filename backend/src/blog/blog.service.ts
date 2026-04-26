import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetches all non-deleted blogs with support for cursor-based pagination,
   * ordering by creation date, and granular search across title, content, and author handle.
   */
  async getAllBlogs(params: {
    cursor?: { id: string };
    take?: number;
    search?: string;
  }) {
    const { cursor, take = 10, search } = params;

    const items = await this.prisma.blog.findMany({
      where: {
        isDeleted: false,
        AND: [
          // Granular Search across Title, Content, and User Handle
          search
            ? {
                OR: [
                  { title: { contains: search, mode: 'insensitive' } },
                  { content: { contains: search, mode: 'insensitive' } },
                  { user: { handle: { contains: search, mode: 'insensitive' } } },
                ],
              }
            : {},
        ],
      },
      take: take + 1, // Fetch one extra item to determine if there's a next page
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor.id } : undefined,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            handle: true,
          },
        },
      },
    });

    let nextCursor: { id: string } | undefined = undefined;
    if (items.length > take) {
      const nextItem = items.pop();
      nextCursor = { id: nextItem!.id };
    }

    return {
      items,
      nextCursor,
    };
  }

  /**
   * Retrieves a single blog by ID.
   * Throws a NotFoundException if the blog is missing or marked as deleted.
   */
  async getBlogById(id: string) {
    const blog = await this.prisma.blog.findUnique({
      where: {
        id,
        isDeleted: false,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            handle: true,
          },
        },
      },
    });

    // Validate existence and deletion status
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found.`);
    }

    return blog;
  }
}
