import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRouter } from './auth.router';
import { TrpcService } from '@/trpc/trpc.service';

@Global()
@Module({
  providers: [AuthService, AuthRouter, TrpcService],
  exports: [AuthService, AuthRouter],
})
export class AuthModule {}
