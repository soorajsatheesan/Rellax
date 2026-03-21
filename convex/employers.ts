import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function normalizeCompanyName(companyName: string) {
  return companyName.trim();
}

async function requireIdentity(ctx: {
  auth: {
    getUserIdentity: () => Promise<
      | {
          subject: string;
          email?: string | null;
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

export const getCurrentEmployer = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("employers")
      .withIndex("by_owner_workos_user_id", (q) =>
        q.eq("ownerWorkOSUserId", identity.subject),
      )
      .unique();
  },
});

export const getCurrentEmployerWorkspace = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    const employer = await ctx.db
      .query("employers")
      .withIndex("by_owner_workos_user_id", (q) =>
        q.eq("ownerWorkOSUserId", identity.subject),
      )
      .unique();

    if (!employer) {
      return null;
    }

    const employees = await ctx.db
      .query("employees")
      .withIndex("by_employer_id", (q) => q.eq("employerId", employer._id))
      .collect();

    return { employer, employees };
  },
});

export const upsertCurrentEmployer = mutation({
  args: {
    companyName: v.string(),
    companyLogoUrl: v.optional(v.string()),
    companyWebsite: v.optional(v.string()),
    industry: v.optional(v.string()),
    companySize: v.optional(v.string()),
    headquarters: v.optional(v.string()),
    aboutCompany: v.optional(v.string()),
    ownerEmail: v.optional(v.string()),
    ownerName: v.optional(v.string()),
    ownerRole: v.optional(v.string()),
    authProvider: v.optional(
      v.union(
        v.literal("password"),
        v.literal("google"),
        v.literal("outlook"),
        v.literal("unknown"),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const companyName = normalizeCompanyName(args.companyName);

    if (!companyName) {
      throw new Error("Company name is required.");
    }

    const now = Date.now();
    const ownerEmail =
      args.ownerEmail?.trim().toLowerCase() ||
      (typeof identity.email === "string" ? identity.email.toLowerCase() : "");
    const ownerName = args.ownerName?.trim();
    const ownerRole = args.ownerRole?.trim();
    const companyLogoUrl = args.companyLogoUrl?.trim();
    const companyWebsite = args.companyWebsite?.trim();
    const industry = args.industry?.trim();
    const companySize = args.companySize?.trim();
    const headquarters = args.headquarters?.trim();
    const aboutCompany = args.aboutCompany?.trim();

    const existingEmployer = await ctx.db
      .query("employers")
      .withIndex("by_owner_workos_user_id", (q) =>
        q.eq("ownerWorkOSUserId", identity.subject),
      )
      .unique();

    if (existingEmployer) {
      await ctx.db.patch(existingEmployer._id, {
        companyName,
        companyLogoUrl: companyLogoUrl || existingEmployer.companyLogoUrl,
        companyWebsite: companyWebsite || existingEmployer.companyWebsite,
        industry: industry || existingEmployer.industry,
        companySize: companySize || existingEmployer.companySize,
        headquarters: headquarters || existingEmployer.headquarters,
        aboutCompany: aboutCompany || existingEmployer.aboutCompany,
        ownerEmail,
        ownerName: ownerName || existingEmployer.ownerName,
        ownerRole: ownerRole || existingEmployer.ownerRole,
        authProvider: args.authProvider ?? existingEmployer.authProvider,
        onboardingCompletedAt: now,
        updatedAt: now,
      });

      return existingEmployer._id;
    }

    return await ctx.db.insert("employers", {
      companyName,
      companyLogoUrl,
      companyWebsite,
      industry,
      companySize,
      headquarters,
      aboutCompany,
      ownerEmail,
      ownerName,
      ownerRole,
      ownerWorkOSUserId: identity.subject,
      authProvider: args.authProvider ?? "unknown",
      createdAt: now,
      onboardingCompletedAt: now,
      updatedAt: now,
    });
  },
});

export const deleteCurrentEmployer = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    const existingEmployer = await ctx.db
      .query("employers")
      .withIndex("by_owner_workos_user_id", (q) =>
        q.eq("ownerWorkOSUserId", identity.subject),
      )
      .unique();

    if (!existingEmployer) {
      return { deleted: false };
    }

    await ctx.db.delete(existingEmployer._id);

    return { deleted: true };
  },
});

export const deleteCurrentEmployerWorkspace = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await requireIdentity(ctx);
    const employer = await ctx.db
      .query("employers")
      .withIndex("by_owner_workos_user_id", (q) =>
        q.eq("ownerWorkOSUserId", identity.subject),
      )
      .unique();

    if (!employer) {
      return { deleted: false };
    }

    const employees = await ctx.db
      .query("employees")
      .withIndex("by_employer_id", (q) => q.eq("employerId", employer._id))
      .collect();

    for (const employee of employees) {
      await ctx.db.delete(employee._id);
    }

    await ctx.db.delete(employer._id);

    return { deleted: true, employeeCount: employees.length };
  },
});
