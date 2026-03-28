import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getAllTrips, getParticipantsByTrip } from "./db";
import { refreshCache } from "./cacheService";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  trips: router({
    list: publicProcedure.query(async () => {
      try {
        const allTrips = await getAllTrips();
        // Load participants for each trip
        const tripsWithParticipants = await Promise.all(
          allTrips.map(async (trip) => {
            const participantsList = await getParticipantsByTrip(trip.id);
            return {
              ...trip,
              participants: participantsList.length,
              participantsList: participantsList,
            };
          })
        );
        return tripsWithParticipants;
      } catch (error) {
        console.error("Error loading trips:", error);
        throw new Error("Failed to load trips");
      }
    }),
    refresh: publicProcedure.mutation(async () => {
      try {
        const trips = await refreshCache();
        return { success: true, trips };
      } catch (error) {
        console.error("Error refreshing trips:", error);
        throw new Error("Failed to refresh trips");
      }
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
