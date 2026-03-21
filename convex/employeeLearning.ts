import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

async function requireEmployeeIdentity(ctx: {
  auth: { getUserIdentity: () => Promise<{ subject: string } | null> };
}) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  return identity;
}

/** Current employee's learning path and modules. */
export const getLearningPathForEmployee = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const employee = await ctx.db
      .query("employees")
      .withIndex("by_workos_user_id", (q) =>
        q.eq("workOSUserId", identity.subject),
      )
      .unique();

    if (!employee) return null;

    const path = await ctx.db
      .query("learning_paths")
      .withIndex("by_employee_id", (q) => q.eq("employeeId", employee._id))
      .order("desc")
      .first();

    if (!path) return null;

    const modules = await ctx.db
      .query("learning_path_modules")
      .withIndex("by_learning_path_id", (q) =>
        q.eq("learningPathId", path._id),
      )
      .order("asc")
      .collect();

    return { path, modules };
  },
});

/** Single module by ID (must belong to current employee's path). */
export const getModuleById = query({
  args: { moduleId: v.id("learning_path_modules") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const module = await ctx.db.get(args.moduleId);
    if (!module) return null;

    const path = await ctx.db.get(module.learningPathId);
    if (!path) return null;

    const employee = await ctx.db
      .query("employees")
      .withIndex("by_workos_user_id", (q) =>
        q.eq("workOSUserId", identity.subject),
      )
      .unique();

    if (!employee || path.employeeId !== employee._id) return null;

    return module;
  },
});

/** Insert resume + learning path + modules. Called from Next.js server action with pre-computed data. */
export const insertResumeAndLearningPath = mutation({
  args: {
    resumeText: v.string(),
    extractedSkills: v.array(v.string()),
    moduleSpecs: v.array(
      v.object({
        title: v.string(),
        category: v.string(),
        duration: v.string(),
        lessons: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await requireEmployeeIdentity(ctx);

    const employee = await ctx.db
      .query("employees")
      .withIndex("by_workos_user_id", (q) =>
        q.eq("workOSUserId", identity.subject),
      )
      .unique();

    if (!employee) throw new Error("Employee profile not found.");

    const now = Date.now();

    const resumeId = await ctx.db.insert("employee_resumes", {
      employeeId: employee._id,
      employerId: employee.employerId,
      resumeText: args.resumeText.slice(0, 50000),
      extractedSkills: args.extractedSkills,
      createdAt: now,
    });

    const pathId = await ctx.db.insert("learning_paths", {
      employeeId: employee._id,
      employerId: employee.employerId,
      sourceResumeId: resumeId,
      createdAt: now,
    });

    for (let i = 0; i < args.moduleSpecs.length; i++) {
      const m = args.moduleSpecs[i];
      await ctx.db.insert("learning_path_modules", {
        learningPathId: pathId,
        title: m.title,
        category: m.category,
        duration: m.duration,
        lessons: m.lessons,
        orderIndex: i,
        status: "not_started",
      });
    }

    return { pathId, resumeId };
  },
});

/** Start a module. */
export const startModule = mutation({
  args: { moduleId: v.id("learning_path_modules") },
  handler: async (ctx, args) => {
    const identity = await requireEmployeeIdentity(ctx);

    const module = await ctx.db.get(args.moduleId);
    if (!module) throw new Error("Module not found.");

    const path = await ctx.db.get(module.learningPathId);
    if (!path) throw new Error("Learning path not found.");

    const employee = await ctx.db
      .query("employees")
      .withIndex("by_workos_user_id", (q) =>
        q.eq("workOSUserId", identity.subject),
      )
      .unique();

    if (!employee || path.employeeId !== employee._id) {
      throw new Error("Unauthorized");
    }

    if (module.status !== "not_started") return; // already started/completed

    await ctx.db.patch(args.moduleId, { status: "in_progress" });
  },
});

/** Complete a module. */
export const completeModule = mutation({
  args: { moduleId: v.id("learning_path_modules") },
  handler: async (ctx, args) => {
    const identity = await requireEmployeeIdentity(ctx);

    const module = await ctx.db.get(args.moduleId);
    if (!module) throw new Error("Module not found.");

    const path = await ctx.db.get(module.learningPathId);
    if (!path) throw new Error("Learning path not found.");

    const employee = await ctx.db
      .query("employees")
      .withIndex("by_workos_user_id", (q) =>
        q.eq("workOSUserId", identity.subject),
      )
      .unique();

    if (!employee || path.employeeId !== employee._id) {
      throw new Error("Unauthorized");
    }

    const now = Date.now();
    await ctx.db.patch(args.moduleId, { status: "completed", completedAt: now });
  },
});
