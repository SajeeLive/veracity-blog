import { Injectable } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { BlogRouter } from '../blog/blog.router';
import { WebauthnRouter } from '../webauthn/webauthn.router';

@Injectable()
export class AppRouterHost {
  public readonly appRouter;

  constructor(
    private readonly trpc: TrpcService,
    private readonly blogRouter: BlogRouter,
    private readonly webauthnRouter: WebauthnRouter,
  ) {
    this.appRouter = this.trpc.router({
      blog: this.blogRouter.router,
      webauthn: this.webauthnRouter.router,
    });
  }
}

export type AppRouter = AppRouterHost['appRouter'];
