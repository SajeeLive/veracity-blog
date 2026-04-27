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
        ctx.res.clearCookie('session');
        return { success: true };
      }),
    });
  }
}
