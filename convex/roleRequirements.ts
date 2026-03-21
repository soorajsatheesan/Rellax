import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

async function requireEmployerIdentity(ctx: {
  auth: {
    getUserIdentity: () => Promise<{ subject: string } | null>;
  };
}) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  return identity;
}

function normalizeRoleKey(title: string) {
  return title.trim().toLowerCase();
}

function normalizeRoleId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

// ─── Queries ─────────────────────────────────────────────────────────────────

/** All role requirements for the logged-in employer. */
export const getRoleRequirementsForEmployer = query({
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
      .query("role_requirements")
      .withIndex("by_employer_role_key", (q) =>
        q.eq("employerId", employer._id),
      )
      .collect();
  },
});

/** Single role requirement by employerId + roleTitle (for employee gap analysis). */
export const getRoleRequirementsByEmployerAndRole = query({
  args: {
    employerId: v.id("employers"),
    roleId: v.optional(v.string()),
    roleTitle: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.roleId?.trim()) {
      return await ctx.db
        .query("role_requirements")
        .withIndex("by_employer_role_id", (q) =>
          q.eq("employerId", args.employerId).eq("roleId", normalizeRoleId(args.roleId!)),
        )
        .unique();
    }

    if (args.roleTitle?.trim()) {
      return await ctx.db
        .query("role_requirements")
        .withIndex("by_employer_role_key", (q) =>
          q
            .eq("employerId", args.employerId)
            .eq("roleKey", normalizeRoleKey(args.roleTitle!)),
        )
        .unique();
    }

    return null;
  },
});

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Create or update a role requirement for the logged-in employer. */
export const upsertRoleRequirement = mutation({
  args: {
    roleTitle: v.string(),
    roleId: v.optional(v.string()),
    roleKey: v.optional(v.string()),
    requiredSkills: v.array(v.string()),
    preferredSkills: v.optional(v.array(v.string())),
    responsibilities: v.optional(v.array(v.string())),
    qualifications: v.optional(v.array(v.string())),
    toolsAndTechnologies: v.optional(v.array(v.string())),
    roleSummary: v.optional(v.string()),
    seniority: v.optional(v.string()),
    sourceJdText: v.optional(v.string()),
    jdText: v.optional(v.string()),
    jdFileUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireEmployerIdentity(ctx);
    const roleTitle = args.roleTitle.trim();
    const roleKey = normalizeRoleKey(args.roleKey ?? args.roleTitle);
    const roleId = normalizeRoleId(args.roleId ?? roleTitle);

    if (!roleTitle) throw new Error("Role title is required.");
    if (!roleKey) throw new Error("Role key is required.");
    if (!roleId) throw new Error("Role ID is required.");
    if (args.requiredSkills.length === 0) {
      throw new Error("At least one required skill is needed.");
    }

    const employer = await ctx.db
      .query("employers")
      .withIndex("by_owner_workos_user_id", (q) =>
        q.eq("ownerWorkOSUserId", identity.subject),
      )
      .unique();

    if (!employer) throw new Error("Employer profile not found.");

    const existing = await ctx.db
      .query("role_requirements")
      .withIndex("by_employer_role_key", (q) =>
        q.eq("employerId", employer._id).eq("roleKey", roleKey),
      )
      .unique();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        roleTitle,
        roleId,
        roleKey,
        requiredSkills: args.requiredSkills,
        preferredSkills: args.preferredSkills,
        responsibilities: args.responsibilities,
        qualifications: args.qualifications,
        toolsAndTechnologies: args.toolsAndTechnologies,
        roleSummary: args.roleSummary,
        seniority: args.seniority,
        sourceJdText: args.sourceJdText,
        jdText: args.jdText,
        jdFileUrl: args.jdFileUrl,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("role_requirements", {
      employerId: employer._id,
      roleTitle,
      roleId,
      roleKey,
      requiredSkills: args.requiredSkills,
      preferredSkills: args.preferredSkills,
      responsibilities: args.responsibilities,
      qualifications: args.qualifications,
      toolsAndTechnologies: args.toolsAndTechnologies,
      roleSummary: args.roleSummary,
      seniority: args.seniority,
      sourceJdText: args.sourceJdText,
      jdText: args.jdText,
      jdFileUrl: args.jdFileUrl,
      updatedAt: now,
    });
  },
});

/** Delete a role requirement by its document ID. */
export const deleteRoleRequirement = mutation({
  args: { id: v.id("role_requirements") },
  handler: async (ctx, args) => {
    const identity = await requireEmployerIdentity(ctx);

    const employer = await ctx.db
      .query("employers")
      .withIndex("by_owner_workos_user_id", (q) =>
        q.eq("ownerWorkOSUserId", identity.subject),
      )
      .unique();

    if (!employer) throw new Error("Employer profile not found.");

    const requirement = await ctx.db.get(args.id);
    if (!requirement || requirement.employerId !== employer._id) {
      throw new Error("Not found.");
    }

    await ctx.db.delete(args.id);
    return { deleted: true };
  },
});
