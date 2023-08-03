import { z } from "zod";
import {
  createTRPCRouter,
  //   publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const noteRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.note.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        NoteTag: {
          include: {
            tag: true,
          },
        },
      },
    });
  }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.note.findUnique({
        where: {
          userId: ctx.session.user.id,
          id: input.id,
        },
        include: {
          NoteTag: {
            include: {
              tag: true,
            },
          },
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        tagIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { title, content, tagIds } = input;
      return await ctx.prisma.note.create({
        data: {
          title: title,
          content: content,
          userId: ctx.session.user.id,
          NoteTag: {
            create: tagIds.map((tagId) => ({
              tag: {
                connect: {
                  id: tagId,
                },
              },
            })),
          },
        },
        include: {
          NoteTag: true,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        noteId: z.string(),
        title: z.string(),
        content: z.string(),
        tagIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { title, content, tagIds, noteId } = input;
      return await ctx.prisma.note.update({
        where: {
          id: noteId,
        },
        data: {
          title: title,
          content: content,
          userId: ctx.session.user.id,
          NoteTag: {
            deleteMany: {},
            create: tagIds.map((tag) => ({
              tag: {
                connect: {
                  id: tag,
                },
              },
            })),
          },
        },
        include: {
          NoteTag: true,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.note.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
