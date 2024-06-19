import { initTRPC } from '@trpc/server';
import { transformer } from '@/utils/transformer';
import type { Context } from './context'
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
    transformer,
    errorFormatter({ shape }) {
        return shape;
    }
});
// Base router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;
export const mergeRouters = t.mergeRouters;
export const createCallerFactory = t.createCallerFactory;