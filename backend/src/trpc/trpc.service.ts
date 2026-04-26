import { Injectable } from '@nestjs/common';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';

export interface Context {
  req: Request;
  res: Response;
  user: { id: string; handle: string } | null;
}

@Injectable()
export class TrpcService {
  constructor(private readonly authService: AuthService) {}

  async createContext({
    req,
    res,
  }: {
    req: Request;
    res: Response;
  }): Promise<Context> {
    const token = req.cookies['session'];
    let user = null;

    if (token) {
      const payload = this.authService.verifySession(token);
      if (payload) {
        user = { id: payload.sub, handle: payload.handle };
      }
    }

    return { req, res, user };
  }

  readonly trpc = initTRPC.context<Context>().create({
    transformer: superjson,
  });

  readonly procedure = this.trpc.procedure;
  readonly authedProcedure = this.trpc.procedure.use(({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({ ctx: { user: ctx.user } });
  });
  readonly router = this.trpc.router;
}
