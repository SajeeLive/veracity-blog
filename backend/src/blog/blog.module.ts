import { Module, forwardRef } from '@nestjs/common';
import { BlogRouter } from './blog.router';
import { BlogService } from './blog.service';
import { TrpcModule } from '../trpc/trpc.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [forwardRef(() => TrpcModule), PrismaModule], // Import the module that has TrpcService
  providers: [BlogRouter, BlogService],
  exports: [BlogRouter],
})
export class BlogModule {}
