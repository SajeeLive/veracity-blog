import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TrpcModule } from './trpc/trpc.module';
import { BlogModule } from './blog/blog.module';
import { envSchema } from './config/env.validation';
import webauthnConfig from './config/webauthn.config';
import authConfig from './config/auth.config';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebauthnModule } from './webauthn/webauthn.module';
import { AuthModule } from './auth/auth.module';
import { MyDeskModule } from './my-desk/my-desk.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // No need to import into other modules
      validate: (config) => envSchema.parse(config),
      load: [webauthnConfig, authConfig],
      envFilePath: '.env',
      expandVariables: true,
    }),
    TrpcModule,
    BlogModule,
    PrismaModule,
    WebauthnModule,
    AuthModule,
    MyDeskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
