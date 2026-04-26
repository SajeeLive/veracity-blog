import { Injectable } from '@nestjs/common';
import { TrpcService } from '../trpc/trpc.service';
import { getAllBlogsSchema, getBlogByIdSchema } from './blog.types';
import { BlogService } from './blog.service';

@Injectable()
export class BlogRouter {
  // Define the type here
  public router;

  constructor(
    private readonly trpc: TrpcService,
    private readonly blogService: BlogService,
  ) {
    // Initialize here, after 'trpc' is injected and available
    this.router = this.trpc.router({
      getAllBlogs: this.trpc.procedure
        .input(getAllBlogsSchema)
        .query(async ({ input }) => {
          return await this.blogService.getAllBlogs({
            cursor: input?.cursor,
            take: input?.take,
            search: input?.search,
          });
        }),

      getBlogById: this.trpc.procedure
        .input(getBlogByIdSchema)
        .query(async ({ input }) => {
          return await this.blogService.getBlogById(input.id);
        }),
    });
  }
}
