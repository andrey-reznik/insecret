import type { RouterClient } from '@orpc/server'

import { protectedProcedure, publicProcedure } from '../index'

export const appRouter = {
  healthCheck: publicProcedure
    .route({ method: 'POST', path: '/api/healthCheck', successStatus: 200 })
    .handler(() => {
      return 'OK'
    }),
  privateData: protectedProcedure
    .route({ method: 'POST', path: '/api/privateData', successStatus: 200 })
    .handler(({ context }) => {
      return {
        message: 'This is private',
        user: context.session?.user,
      }
    }),
}
export type AppRouter = typeof appRouter
export type AppRouterClient = RouterClient<typeof appRouter>
