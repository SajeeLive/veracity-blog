import { Global, Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRouter } from './auth.router';
import { TrpcModule } from '@/trpc/trpc.module';
import { PrismaModule } from '@/prisma/prisma.module';

@Global()
@Module({
  imports: [forwardRef(() => TrpcModule), PrismaModule],
  providers: [AuthService, AuthRouter],
  exports: [AuthService, AuthRouter],
})
export class AuthModule {}
