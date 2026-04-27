import { Injectable } from '@nestjs/common';
import { TrpcService } from './trpc.service';
import { BlogRouter } from '../blog/blog.router';
import { WebauthnRouter } from '../webauthn/webauthn.router';
import { AuthRouter } from '../auth/auth.router';
import { MyDeskRouter } from '../my-desk/my-desk.router';

@Injectable()
export class AppRouterHost {
  public readonly appRouter;

  constructor(
    private readonly trpc: TrpcService,
    private readonly blogRouter: BlogRouter,
    private readonly webauthnRouter: WebauthnRouter,
    private readonly authRouter: AuthRouter,
    private readonly myDeskRouter: MyDeskRouter,
  ) {
    this.appRouter = this.trpc.router({
      blog: this.blogRouter.router,
      webauthn: this.webauthnRouter.router,
      auth: this.authRouter.router,
      myDesk: this.myDeskRouter.router,
    });
  }
}

export type AppRouter = AppRouterHost['appRouter'];
