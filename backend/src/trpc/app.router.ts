import { Injectable } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { BlogRouter } from '../blog/blog.router';

@Injectable()
export class AppRouterHost {
  // 1. Declare the property without initializing it immediately
  public readonly appRouter;

  constructor(
    private readonly trpc: TrpcService,
    private readonly blogRouter: BlogRouter,
  ) {
    // 2. Initialize inside the constructor. 
    // Now 'trpc' and 'blogRouter' are fully available.
    this.appRouter = this.trpc.router({
      blog: this.blogRouter.router,
    });
  }
}

// 3. Export the type for the frontend
export type AppRouter = AppRouterHost['appRouter'];