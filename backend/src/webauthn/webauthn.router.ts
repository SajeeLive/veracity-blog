import { Injectable } from '@nestjs/common';
import { TrpcService } from '../trpc/trpc.service';
import { WebauthnService } from './webauthn.service';
import { AuthService } from '../auth/auth.service';
import {
  getRegistrationOptionsSchema,
  verifyRegistrationSchema,
} from './webauthn.types';

@Injectable()
export class WebauthnRouter {
  public router;

  constructor(
    private readonly trpc: TrpcService,
    private readonly webauthnService: WebauthnService,
    private readonly authService: AuthService,
  ) {
    this.router = this.trpc.router({
      getRegistrationOptions: this.trpc.procedure
        .input(getRegistrationOptionsSchema)
        .query(async ({ input }) => {
          return await this.webauthnService.getRegistrationOptions(
            input.handle,
          );
        }),
      verifyRegistration: this.trpc.procedure
        .input(verifyRegistrationSchema)
        .mutation(async ({ input, ctx }) => {
          const user = await this.webauthnService.verifyRegistration(
            input.handle,
            input.response,
          );

          const token = this.authService.signSession({
            sub: user.id,
            handle: user.handle,
          });

          ctx.res.cookie('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });

          return { verified: true, user };
        }),
    });
  }
}
