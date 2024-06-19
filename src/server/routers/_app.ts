import { router, procedure, createCallerFactory } from '@/server/trpc';
import { membersRouter } from './members';

export const appRouter = router({
  members: membersRouter
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;