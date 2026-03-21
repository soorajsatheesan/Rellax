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

/** Normalise a role title so employer + employee rows always match. */
function normalizeRoleTitle(title: string) {
  return title.trim().toLowerCase();
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
      .withIndex("by_employer_role_title", (q) =>
        q.eq("employerId", employer._id),
      )
      .collect();
  },
});

/** Single role requirement by employerId + roleTitle (for employee gap analysis). */
export const getRoleRequirementsByEmployerAndRole = query({
  args: {
    employerId: v.id("employers"),
    roleTitle: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("role_requirements")
      .withIndex("by_employer_role_title", (q) =>
        q
          .eq("employerId", args.employerId)
          .eq("roleTitle", normalizeRoleTitle(args.roleTitle)),
      )
      .unique();
  },
});

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Create or update a role requirement for the logged-in employer. */
export const upsertRoleRequirement = mutation({
  args: {
    roleTitle: v.string(),
    roleId: v.optional(v.string()),
    requiredSkills: v.array(v.string()),
    jdText: v.optional(v.string()),
    jdFileUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireEmployerIdentity(ctx);
    const roleTitle = normalizeRoleTitle(args.roleTitle);

    if (!roleTitle) throw new Error("Role title is required.");
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
      .withIndex("by_employer_role_title", (q) =>
        q.eq("employerId", employer._id).eq("roleTitle", roleTitle),
      )
      .unique();

    const now = Date.now();
    const roleId = args.roleId?.trim() || undefined;

    if (existing) {
      await ctx.db.patch(existing._id, {
        roleId,
        requiredSkills: args.requiredSkills,
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
      requiredSkills: args.requiredSkills,
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
