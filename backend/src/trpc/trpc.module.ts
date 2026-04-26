import { Module, forwardRef } from '@nestjs/common';
import { BlogModule } from '../blog/blog.module';
import { WebauthnModule } from '../webauthn/webauthn.module';
import { TrpcService } from './trpc.service';
import { AppRouterHost } from './app.router';

@Module({
  imports: [forwardRef(() => BlogModule), forwardRef(() => WebauthnModule)],
  providers: [TrpcService, AppRouterHost],
  exports: [TrpcService, AppRouterHost],
})
export class TrpcModule {}
