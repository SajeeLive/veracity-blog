import { Module, forwardRef } from '@nestjs/common';
import { WebauthnService } from './webauthn.service';
import { WebauthnRouter } from './webauthn.router';
import { PrismaModule } from '../prisma/prisma.module';
import { TrpcModule } from '../trpc/trpc.module';

@Module({
  imports: [PrismaModule, forwardRef(() => TrpcModule)],
  providers: [WebauthnService, WebauthnRouter],
  exports: [WebauthnRouter],
})
export class WebauthnModule {}
