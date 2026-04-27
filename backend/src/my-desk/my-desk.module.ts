import { Module, forwardRef } from '@nestjs/common';
import { TrpcModule } from '../trpc/trpc.module';
import { MyDeskService } from './my-desk.service';
import { MyDeskRouter } from './my-desk.router';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [forwardRef(() => TrpcModule), PrismaModule],
  providers: [MyDeskService, MyDeskRouter],
  exports: [MyDeskService, MyDeskRouter],
})
export class MyDeskModule {}
