import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TrpcModule } from './trpc/trpc.module';
import {BlogModule}  from './blog/blog.module';
import { envSchema } from './config/env.validation';
import webauthnConfig from './config/webauthn.config';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // No need to import into other modules
      validate: (config) => envSchema.parse(config),
      load: [webauthnConfig],
      envFilePath: '.env',
      expandVariables: true,
    }),
    TrpcModule,
    BlogModule,
    PrismaModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}