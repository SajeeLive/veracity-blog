import { Module, forwardRef } from '@nestjs/common';
import { BlogModule } from '../blog/blog.module';
import { TrpcService } from './trpc.service';
import { AppRouterHost } from './app.router';

@Module({
  // Use forwardRef because TrpcModule imports BlogModule 
  // and BlogModule will now import TrpcModule
  imports: [forwardRef(() => BlogModule)], 
  providers: [TrpcService, AppRouterHost],
  exports: [TrpcService, AppRouterHost], // CRITICAL: Export TrpcService
})
export class TrpcModule {}