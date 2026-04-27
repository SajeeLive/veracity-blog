import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateMyBlogInput,
  GetMyBlogsInput,
  UpdateMyBlogInput,
} from './my-desk.types';

@Injectable()
export class MyDeskService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyBlogs(userId: string, params: GetMyBlogsInput) {
    const { cursor, take, search, isDeleted } = params;

    const items = await this.prisma.blog.findMany({
      where: {
        userId,
        AND: [
          search
            ? {
                OR: [
                  { title: { contains: search, mode: 'insensitive' } },
                  { content: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
        ],
      },
      take: take + 1,
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
        updatedAt: true,
        isDeleted: true,
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

  async getMyBlogById(userId: string, blogId: string) {
    const blog = await this.prisma.blog.findFirst({
      where: {
        id: blogId,
        userId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
      },
    });

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${blogId} not found.`);
    }

    return blog;
  }

  async createMyBlog(userId: string, input: CreateMyBlogInput) {
    return this.prisma.blog.create({
      data: {
        ...input,
        userId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
      },
    });
  }

  async updateMyBlog(userId: string, input: UpdateMyBlogInput) {
    const { id, ...data } = input;

    // Verify ownership
    const blog = await this.prisma.blog.findFirst({
      where: { id, userId },
    });

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found.`);
    }

    return this.prisma.blog.update({
      where: { id },
      data,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
      },
    });
  }
}
