import { Injectable } from '@nestjs/common';
import { initTRPC } from '@trpc/server';

@Injectable()
export class TrpcService {
  readonly trpc = initTRPC.create();
  readonly procedure = this.trpc.procedure;
  readonly router = this.trpc.router;
}