import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TrpcModule } from './trpc/trpc.module';
import {BlogModule}  from './blog/blog.module';
import { envSchema } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // No need to import into other modules
      validate: (config) => envSchema.parse(config),
      envFilePath: '.env',
      expandVariables: true,
    }),
    TrpcModule,
    BlogModule,
    ],
})
export class AppModule {}