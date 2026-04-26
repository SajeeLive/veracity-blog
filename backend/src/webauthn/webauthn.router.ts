import { Injectable } from '@nestjs/common';
import { TrpcService } from '../trpc/trpc.service';
import { WebauthnService } from './webauthn.service';
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
        .mutation(async ({ input }) => {
          return await this.webauthnService.verifyRegistration(
            input.handle,
            input.response,
          );
        }),
    });
  }
}
