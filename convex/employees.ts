import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

async function requireIdentity(ctx: {
  auth: {
    getUserIdentity: () => Promise<
      | {
          subject: string;
        }
      | null
    >;
  };
}) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("Unauthorized");
  }

  return identity;
}

export const getCurrentEmployeeProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    const employee = await ctx.db
      .query("employees")
      .withIndex("by_workos_user_id", (q) =>
        q.eq("workOSUserId", identity.subject),
      )
      .unique();

    if (!employee) {
      return null;
    }

    const employer = await ctx.db.get(employee.employerId);

    return { employee, employer };
  },
});

export const createEmployeeForCurrentEmployer = mutation({
  args: {
    employeeId: v.string(),
    workOSUserId: v.string(),
    email: v.string(),
    fullName: v.string(),
    roleTitle: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const employer = await ctx.db
      .query("employers")
      .withIndex("by_owner_workos_user_id", (q) =>
        q.eq("ownerWorkOSUserId", identity.subject),
      )
      .unique();

    if (!employer) {
      throw new Error("Complete employer onboarding before inviting employees.");
    }

    const employeeId = args.employeeId.trim();
    const existingEmployee = await ctx.db
      .query("employees")
      .withIndex("by_employee_id", (q) => q.eq("employeeId", employeeId))
      .unique();

    const now = Date.now();
    const email = args.email.trim().toLowerCase();
    const fullName = args.fullName.trim();
    const roleTitle = args.roleTitle.trim();

    if (!employeeId || !email || !fullName || !roleTitle) {
      throw new Error("Employee ID, name, role, and email are required.");
    }

    if (existingEmployee) {
      await ctx.db.patch(existingEmployee._id, {
        employeeId,
        workOSUserId: args.workOSUserId,
        email,
        fullName,
        roleTitle,
        updatedAt: now,
      });

      return existingEmployee._id;
    }

    return await ctx.db.insert("employees", {
      employerId: employer._id,
      employerWorkOSUserId: employer.ownerWorkOSUserId,
      employeeId,
      workOSUserId: args.workOSUserId,
      email,
      fullName,
      roleTitle,
      createdAt: now,
      updatedAt: now,
      status: "active",
    });
  },
});
