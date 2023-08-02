import { z } from "zod";
import {
  createTRPCRouter,
  //   publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const tagRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.tag.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  create: protectedProcedure
    .input(z.object({ tag: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.tag.create({
        data: {
          title: input.tag,
          userId: ctx.session.user.id,
        },
      });
    }),
});
