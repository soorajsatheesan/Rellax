import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** All progress records for employees under the logged-in employer. */
export const getEmployeeProgressByEmployer = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const employer = await ctx.db
      .query("employers")
      .withIndex("by_owner_workos_user_id", (q) =>
        q.eq("ownerWorkOSUserId", identity.subject),
      )
      .unique();

    if (!employer) return [];

    return await ctx.db
      .query("employee_progress")
      .withIndex("by_employer_id", (q) => q.eq("employerId", employer._id))
      .collect();
  },
});

/** Create or update a progress record for a given employee. */
export const upsertEmployeeProgress = mutation({
  args: {
    employeeId: v.id("employees"),
    progressPercentage: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const employer = await ctx.db
      .query("employers")
      .withIndex("by_owner_workos_user_id", (q) =>
        q.eq("ownerWorkOSUserId", identity.subject),
      )
      .unique();

    if (!employer) throw new Error("Employer profile not found.");

    const pct = Math.max(0, Math.min(100, Math.round(args.progressPercentage)));

    const existing = await ctx.db
      .query("employee_progress")
      .withIndex("by_employee_id", (q) =>
        q.eq("employeeId", args.employeeId),
      )
      .unique();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, { progressPercentage: pct, updatedAt: now });
      return existing._id;
    }

    return await ctx.db.insert("employee_progress", {
      employeeId: args.employeeId,
      employerId: employer._id,
      progressPercentage: pct,
      updatedAt: now,
    });
  },
});
