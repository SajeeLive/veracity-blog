import { Injectable } from '@nestjs/common';
import { TrpcService } from '../trpc/trpc.service';
import { z } from 'zod';

const STATIC_BLOGS = [
  { id: 1, title: 'First Post', content: 'Hello World' },
  { id: 2, title: 'Second Post', content: 'NestJS + tRPC is great' },
];

@Injectable()
export class BlogRouter {
  // Define the type here
  public router;

  constructor(private readonly trpc: TrpcService) {
    // Initialize here, after 'trpc' is injected and available
    this.router = this.trpc.router({
      getAllBlogs: this.trpc.procedure.query(() => {
        return STATIC_BLOGS;
      }),
      
      getBlogById: this.trpc.procedure
        .input(z.object({ id: z.number() }))
        .query(({ input }) => {
          return STATIC_BLOGS.find((blog) => blog.id === input.id) ?? null;
        }),
    });
  }
}