import { Module, forwardRef } from '@nestjs/common';
import { BlogRouter } from './blog.router';
import { PrismaService } from '../prisma/prisma.service';
import { BlogService } from './blog.service';
import { TrpcModule } from '../trpc/trpc.module';

@Module({
  imports: [forwardRef(() => TrpcModule)], // Import the module that has TrpcService
  providers: [BlogRouter, BlogService, PrismaService],
  exports: [BlogRouter],
})
export class BlogModule {}
