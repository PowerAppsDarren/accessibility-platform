import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

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

  // Departments CRUD
  departments: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllDepartments();
    }),
    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await db.getDepartmentById(input.id);
    }),
    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          departmentHeadId: z.number().optional(),
          managerId: z.number().optional(),
          lastContactDate: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const data = {
          ...input,
          lastContactDate: input.lastContactDate ? new Date(input.lastContactDate) : undefined,
        };
        const id = await db.createDepartment(data);
        return { id };
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          departmentHeadId: z.number().optional(),
          managerId: z.number().optional(),
          lastContactDate: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...rest } = input;
        const data = {
          ...rest,
          lastContactDate: rest.lastContactDate ? new Date(rest.lastContactDate) : undefined,
        };
        await db.updateDepartment(id, data);
        return { success: true };
      }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteDepartment(input.id);
      return { success: true };
    }),
  }),

  // People CRUD
  people: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllPeople();
    }),
    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await db.getPersonById(input.id);
    }),
    create: protectedProcedure
      .input(
        z.object({
          firstName: z.string(),
          lastName: z.string(),
          departmentId: z.number().optional(),
          lastContactDate: z.string().optional(),
          champion: z.enum(["No", "In Progress", "Yes"]).optional(),
          levelAccessAccount: z.enum(["No", "In Progress", "On hold", "Troubleshooting", "Complete"]).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const data = {
          ...input,
          lastContactDate: input.lastContactDate ? new Date(input.lastContactDate) : undefined,
        };
        const id = await db.createPerson(data);
        return { id };
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          departmentId: z.number().optional(),
          lastContactDate: z.string().optional(),
          champion: z.enum(["No", "In Progress", "Yes"]).optional(),
          levelAccessAccount: z.enum(["No", "In Progress", "On hold", "Troubleshooting", "Complete"]).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...rest } = input;
        const data = {
          ...rest,
          lastContactDate: rest.lastContactDate ? new Date(rest.lastContactDate) : undefined,
        };
        await db.updatePerson(id, data);
        return { success: true };
      }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deletePerson(input.id);
      return { success: true };
    }),
  }),

  // Websites CRUD
  websites: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllWebsites();
    }),
    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await db.getWebsiteById(input.id);
    }),
    create: protectedProcedure
      .input(
        z.object({
          url: z.string().optional(),
          departmentId: z.number().optional(),
          contactId: z.number().optional(),
          managerId: z.number().optional(),
          lastContactDate: z.string().optional(),
          ownerId: z.number().optional(),
          archived: z.boolean().optional(),
          accessibilityReviewed: z.boolean().optional(),
          siteimproveScore: z.number().optional(),
          manualReview: z.boolean().optional(),
          remediationPlan: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const data = {
          ...input,
          lastContactDate: input.lastContactDate ? new Date(input.lastContactDate) : undefined,
        };
        const id = await db.createWebsite(data);
        return { id };
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          url: z.string().optional(),
          departmentId: z.number().optional(),
          contactId: z.number().optional(),
          managerId: z.number().optional(),
          lastContactDate: z.string().optional(),
          ownerId: z.number().optional(),
          archived: z.boolean().optional(),
          accessibilityReviewed: z.boolean().optional(),
          siteimproveScore: z.number().optional(),
          manualReview: z.boolean().optional(),
          remediationPlan: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...rest } = input;
        const data = {
          ...rest,
          lastContactDate: rest.lastContactDate ? new Date(rest.lastContactDate) : undefined,
        };
        await db.updateWebsite(id, data);
        return { success: true };
      }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteWebsite(input.id);
      return { success: true };
    }),
  }),

  // Applications CRUD
  applications: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllApplications();
    }),
    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await db.getApplicationById(input.id);
    }),
    create: protectedProcedure
      .input(
        z.object({
          url: z.string().optional(),
          departmentId: z.number().optional(),
          contactName: z.string().optional(),
          vendorId: z.number().optional(),
          lastContactDate: z.string().optional(),
          vpatOrAcr: z.boolean().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const data = {
          ...input,
          lastContactDate: input.lastContactDate ? new Date(input.lastContactDate) : undefined,
        };
        const id = await db.createApplication(data);
        return { id };
      }),
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          url: z.string().optional(),
          departmentId: z.number().optional(),
          contactName: z.string().optional(),
          vendorId: z.number().optional(),
          lastContactDate: z.string().optional(),
          vpatOrAcr: z.boolean().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...rest } = input;
        const data = {
          ...rest,
          lastContactDate: rest.lastContactDate ? new Date(rest.lastContactDate) : undefined,
        };
        await db.updateApplication(id, data);
        return { success: true };
      }),
    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await db.deleteApplication(input.id);
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
