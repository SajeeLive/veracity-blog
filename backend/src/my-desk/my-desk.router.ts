import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { TrpcService } from '../trpc/trpc.service';
import { MyDeskService } from './my-desk.service';
import {
  CreateMyBlogSchema,
  GetMyBlogsSchema,
  UpdateMyBlogSchema,
} from './my-desk.types';

@Injectable()
export class MyDeskRouter {
  public readonly router;

  constructor(
    private readonly trpc: TrpcService,
    private readonly myDeskService: MyDeskService,
  ) {
    this.router = this.trpc.router({
      getMyBlogs: this.trpc.authedProcedure
        .input(GetMyBlogsSchema)
        .query(async ({ ctx, input }) => {
          return this.myDeskService.getMyBlogs(ctx.user.id, input);
        }),

      getMyBlogById: this.trpc.authedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
          return this.myDeskService.getMyBlogById(ctx.user.id, input.id);
        }),

      createMyBlog: this.trpc.authedProcedure
        .input(CreateMyBlogSchema)
        .mutation(async ({ ctx, input }) => {
          return this.myDeskService.createMyBlog(ctx.user.id, input);
        }),

      updateMyBlog: this.trpc.authedProcedure
        .input(UpdateMyBlogSchema)
        .mutation(async ({ ctx, input }) => {
          return this.myDeskService.updateMyBlog(ctx.user.id, input);
        }),
    });
  }
}
