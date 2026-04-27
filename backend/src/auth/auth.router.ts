import { Injectable } from '@nestjs/common';
import { TrpcService } from '../trpc/trpc.service';

@Injectable()
export class AuthRouter {
  public router;

  constructor(private readonly trpc: TrpcService) {
    this.router = this.trpc.router({
      getMe: this.trpc.procedure.query(({ ctx }) => {
        return ctx.user;
      }),
      signOut: this.trpc.procedure.mutation(({ ctx }) => {
        const isProd =
          process.env.NODE_ENV === 'production' ||
          process.env.FRONTEND_URL?.startsWith('https://');

        ctx.res.clearCookie('session', {
          httpOnly: true,
          secure: isProd,
          sameSite: isProd ? 'none' : 'lax',
        });
        return { success: true };
      }),
    });
  }
}
