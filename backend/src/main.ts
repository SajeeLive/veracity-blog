import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as trpcExpress from '@trpc/server/adapters/express';
import { AppRouterHost } from './trpc/app.router';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT') || Number(process.env.PORT) || 8080;
  const frontendUrl = configService.get<string>('FRONTEND_URL');

  if (!port) {
    throw new Error('PORT is not defined in environment variables');
  }

  if (!frontendUrl) {
    throw new Error('FRONTEND_URL is not defined in environment variables');
  } 

  app.enableCors({
    origin: frontendUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Merge routers into a single root
 const { appRouter } = app.get(AppRouterHost);

  app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
    }),
  );

 await app.listen(port, '0.0.0.0');
}
bootstrap();
