import { prisma } from "@/server/prisma";
import { router, procedure } from '@/server/trpc';
import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

const defaultMemberSelect = {
  id: true,
  accountId: true,
  createdAt: true,
  updatedAt: true,
  name: true,
  position: true,
  hireDate: true,
  birthDate: true,
  contactNumber: true,
  image: true,
  email: true,
  emergencyContactNumber: true,
  address: true,
  notes: true,
  account: true
} satisfies Prisma.MembersSelect

export const membersRouter = router({
  list: procedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input }) => {
      /**
       * For pagination docs you can have a look here
       * @link https://trpc.io/docs/v11/useInfiniteQuery
       * @link https://www.prisma.io/docs/concepts/components/prisma-client/pagination
       */

      const limit = input.limit ?? 50;
      const { cursor } = input;

      const items = await prisma.members.findMany({
        select: defaultMemberSelect,
        // get an extra item at the end which we'll use as next cursor
        take: limit + 1,
        where: {},
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        orderBy: {
          createdAt: 'desc',
        },
      });
      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        // Remove the last item and use it as next cursor

        const nextItem = items.pop()!;
        nextCursor = nextItem.id;
      }

      return {
        items: items.reverse(),
        nextCursor,
      };
    }),
    byId: procedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;
      const post = await prisma.members.findUnique({
        where: { id },
        select: defaultMemberSelect,
      });
      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No post with id '${id}'`,
        });
      }
      return post;
    }),
    add: procedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        name: z.string().min(1).max(32),
        notes: z.string().min(1),
        accountId: z.string().min(1).max(32),
        createdAt: z.string().min(1).max(32),
        updatedAt: z.string().min(1).max(32),
        position: z.string().min(1).max(32),
        hireDate: z.string().min(1).max(32),
        birthDate: z.string().min(1).max(32),
        contactNumber: z.string().min(1).max(32),
        image: z.string().min(1).max(32),
        email: z.string().min(1).max(32),
        emergencyContactNumber: z.string().min(1).max(32),
        address: z.string().min(1).max(32),
        account: z.string().min(1).max(32)
      }),
    )
    .mutation(async ({ input }) => {
      const post = await prisma.members.create({
        data: input,
        select: defaultMemberSelect,
      });
      return post;
    }),
})
/*
const membersRouter = router({
    getAllMembers: async () => {
      return prisma.members.findMany();
    },

    getMemberById: async ({ id }: { id: string }) => {
      return prisma.members.findUnique({
        where: { id },
      });
    },

    createMember: async ({ name, email }: { name: string; email: string }) => {
      return prisma.members.create({
        data: {
          name,
          email,
        },
      });
    },

    updateMember: async ({ id, name, email }: { id: string; name?: string; email?: string }) => {
      return prisma.members.update({
        where: { id },
        data: {
          name,
          email,
        },
      });
    },

    deleteMember: async ({ id }: { id: string }) => {
      return prisma.members.delete({
        where: { id },
      });
    },
  });
  export type MembersRouter = typeof membersRouter;
  
  export default membersRouter;
  */