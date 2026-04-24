import { Module, forwardRef } from '@nestjs/common';
import { BlogRouter } from './blog.router';
import { TrpcModule } from '../trpc/trpc.module';

@Module({
  imports: [forwardRef(() => TrpcModule)], // Import the module that has TrpcService
  providers: [BlogRouter],
  exports: [BlogRouter],
})
export class BlogModule {}