import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

async function requireEmployeeIdentity(ctx: {
  auth: { getUserIdentity: () => Promise<{ subject: string } | null> };
}) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");
  return identity;
}

async function getCurrentEmployeeRecord(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ctx: any,
  options?: { requireIdentity?: boolean },
) {
  const identity = options?.requireIdentity
    ? await requireEmployeeIdentity(ctx)
    : await ctx.auth.getUserIdentity();

  if (!identity) {
    return null;
  }

  return ctx.db
    .query("employees")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .withIndex("by_workos_user_id", (q: any) => q.eq("workOSUserId", identity.subject))
    .unique();
}

export const getLearningPathForEmployee = query({
  args: {},
  handler: async (ctx) => {
    const employee = await getCurrentEmployeeRecord(ctx);
    if (!employee) return null;

    const path = await ctx.db
      .query("learning_paths")
      .withIndex("by_employee_id", (q) => q.eq("employeeId", employee._id))
      .order("desc")
      .first();

    if (!path) return null;

    const modules = await ctx.db
      .query("learning_path_modules")
      .withIndex("by_learning_path_id", (q) => q.eq("learningPathId", path._id))
      .order("asc")
      .collect();

    return { path, modules };
  },
});

export const getModuleById = query({
  args: { moduleId: v.id("learning_path_modules") },
  handler: async (ctx, args) => {
    const employee = await getCurrentEmployeeRecord(ctx);
    if (!employee) return null;

    const learningModule = await ctx.db.get(args.moduleId);
    if (!learningModule) return null;

    const path = await ctx.db.get(learningModule.learningPathId);
    if (!path || path.employeeId !== employee._id) return null;

    return learningModule;
  },
});

export const getGenerationContext = query({
  args: { pathId: v.id("learning_paths") },
  handler: async (ctx, args) => {
    const employee = await getCurrentEmployeeRecord(ctx);
    if (!employee) return null;

    const path = await ctx.db.get(args.pathId);
    if (!path || path.employeeId !== employee._id) return null;

    const employer = await ctx.db.get(employee.employerId);
    if (!employer) return null;

    const resume = path.sourceResumeId ? await ctx.db.get(path.sourceResumeId) : null;
    const modules = await ctx.db
      .query("learning_path_modules")
      .withIndex("by_learning_path_id", (q) => q.eq("learningPathId", path._id))
      .order("asc")
      .collect();

    return { employee, employer, path, resume, modules };
  },
});

export const insertResumeAndRoadmap = mutation({
  args: {
    resumeText: v.string(),
    extractedSkills: v.array(v.string()),
    requiredSkills: v.array(v.string()),
    gapSkills: v.array(v.string()),
    learnerPersonaSummary: v.string(),
    generationVersion: v.string(),
    roadmapModules: v.array(
      v.object({
        title: v.string(),
        category: v.string(),
        summary: v.string(),
        targetSkill: v.string(),
        personalizationNote: v.string(),
        difficulty: v.union(
          v.literal("foundation"),
          v.literal("intermediate"),
          v.literal("advanced"),
        ),
        estimatedMinutes: v.number(),
        learningObjectives: v.array(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const employee = await getCurrentEmployeeRecord(ctx, { requireIdentity: true });
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
      sourceRoleTitle: employee.roleTitle,
      learnerPersonaSummary: args.learnerPersonaSummary,
      requiredSkills: args.requiredSkills,
      gapSkills: args.gapSkills,
      generationVersion: args.generationVersion,
      generationStatus: "roadmap_ready",
      createdAt: now,
    });

    for (let i = 0; i < args.roadmapModules.length; i += 1) {
      const roadmapModule = args.roadmapModules[i];
      await ctx.db.insert("learning_path_modules", {
        learningPathId: pathId,
        title: roadmapModule.title,
        category: roadmapModule.category,
        summary: roadmapModule.summary,
        targetSkill: roadmapModule.targetSkill,
        personalizationNote: roadmapModule.personalizationNote,
        learningObjectives: roadmapModule.learningObjectives,
        duration: `${Math.max(1, Math.round(roadmapModule.estimatedMinutes))} min`,
        lessons: 0,
        sceneCount: 0,
        difficulty: roadmapModule.difficulty,
        estimatedMinutes: roadmapModule.estimatedMinutes,
        generationProvider: "openai",
        generationStatus: "pending",
        notesStatus: "pending",
        videoStatus: "pending",
        qaStatus: "pending",
        orderIndex: i,
        status: "not_started",
      });
    }

    return { pathId, resumeId };
  },
});

export const claimNextModuleForGeneration = mutation({
  args: { pathId: v.id("learning_paths") },
  handler: async (ctx, args) => {
    const employee = await getCurrentEmployeeRecord(ctx, { requireIdentity: true });
    if (!employee) throw new Error("Unauthorized");

    const path = await ctx.db.get(args.pathId);
    if (!path || path.employeeId !== employee._id) {
      throw new Error("Unauthorized");
    }

    const modules = await ctx.db
      .query("learning_path_modules")
      .withIndex("by_learning_path_id", (q) => q.eq("learningPathId", path._id))
      .order("asc")
      .collect();

    const currentModule = path.currentGeneratingModuleId
      ? await ctx.db.get(path.currentGeneratingModuleId)
      : null;

    if (
      currentModule &&
      currentModule.learningPathId === path._id &&
      (currentModule.generationStatus === "processing" ||
        currentModule.generationStatus === "partial" ||
        currentModule.generationStatus === "pending")
    ) {
      await ctx.db.patch(currentModule._id, {
        generationStatus: "processing",
        generationError: undefined,
        notesStatus: currentModule.notesStatus === "ready" ? "ready" : "processing",
        videoStatus: currentModule.videoStatus === "ready" ? "ready" : "pending",
        qaStatus: currentModule.qaStatus === "ready" ? "ready" : "pending",
      });

      await ctx.db.patch(path._id, {
        generationStatus: "generating",
        currentGeneratingModuleId: currentModule._id,
        generationError: undefined,
      });

      return currentModule._id;
    }

    const claimed = modules.find(
      (module) =>
        module.generationStatus === "pending" || module.generationStatus === "partial",
    );

    if (!claimed) {
      await ctx.db.patch(path._id, {
        generationStatus: "ready",
        currentGeneratingModuleId: undefined,
        generationError: undefined,
      });
      return null;
    }

    await ctx.db.patch(claimed._id, {
      generationStatus: "processing",
      generationError: undefined,
      notesStatus: claimed.notesStatus === "ready" ? "ready" : "processing",
      videoStatus: claimed.videoStatus === "ready" ? "ready" : "pending",
      qaStatus: claimed.qaStatus === "ready" ? "ready" : "pending",
    });
    await ctx.db.patch(path._id, {
      generationStatus: "generating",
      currentGeneratingModuleId: claimed._id,
      generationError: undefined,
    });

    return claimed._id;
  },
});

export const saveModuleNotes = mutation({
  args: {
    moduleId: v.id("learning_path_modules"),
    notesContent: v.string(),
    knowledgeChecks: v.array(v.string()),
    personalizationNote: v.string(),
    videoStyle: v.string(),
  },
  handler: async (ctx, args) => {
    const employee = await getCurrentEmployeeRecord(ctx, { requireIdentity: true });
    if (!employee) throw new Error("Unauthorized");

    const learningModule = await ctx.db.get(args.moduleId);
    if (!learningModule) throw new Error("Module not found.");

    const path = await ctx.db.get(learningModule.learningPathId);
    if (!path || path.employeeId !== employee._id) throw new Error("Unauthorized");

    await ctx.db.patch(args.moduleId, {
      notesContent: args.notesContent,
      knowledgeChecks: args.knowledgeChecks,
      personalizationNote: args.personalizationNote,
      videoStyle: args.videoStyle,
      notesStatus: "ready",
      generationStatus: "partial",
      generationError: undefined,
    });
  },
});

export const saveModuleVideo = mutation({
  args: {
    moduleId: v.id("learning_path_modules"),
    slides: v.array(
      v.object({
        title: v.string(),
        focus: v.optional(v.string()),
        bullets: v.array(v.string()),
        speakerNotes: v.string(),
        narration: v.string(),
        takeaway: v.optional(v.string()),
        visualCue: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        imageSourceUrl: v.optional(v.string()),
        imageCaption: v.optional(v.string()),
        layoutVariant: v.optional(v.string()),
        approxDurationSec: v.number(),
        audioUrl: v.optional(v.string()),
        audioChunks: v.optional(v.array(v.string())),
      }),
    ),
    narrationScript: v.string(),
    duration: v.string(),
    slideDeckUrl: v.string(),
    transcriptUrl: v.string(),
    artifactManifestUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const employee = await getCurrentEmployeeRecord(ctx, { requireIdentity: true });
    if (!employee) throw new Error("Unauthorized");

    const learningModule = await ctx.db.get(args.moduleId);
    if (!learningModule) throw new Error("Module not found.");

    const path = await ctx.db.get(learningModule.learningPathId);
    if (!path || path.employeeId !== employee._id) throw new Error("Unauthorized");

    await ctx.db.patch(args.moduleId, {
      slides: args.slides,
      narrationScript: args.narrationScript,
      duration: args.duration,
      lessons: args.slides.length,
      sceneCount: args.slides.length,
      slideDeckUrl: args.slideDeckUrl,
      transcriptUrl: args.transcriptUrl,
      artifactManifestUrl: args.artifactManifestUrl,
      videoStatus: "ready",
      generationStatus: "partial",
      generationError: undefined,
    });
  },
});

export const saveModuleQa = mutation({
  args: {
    moduleId: v.id("learning_path_modules"),
    qaPairs: v.array(
      v.object({
        question: v.string(),
        options: v.array(v.string()),
        correctAnswer: v.string(),
        explanation: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const employee = await getCurrentEmployeeRecord(ctx, { requireIdentity: true });
    if (!employee) throw new Error("Unauthorized");

    const learningModule = await ctx.db.get(args.moduleId);
    if (!learningModule) throw new Error("Module not found.");

    const path = await ctx.db.get(learningModule.learningPathId);
    if (!path || path.employeeId !== employee._id) throw new Error("Unauthorized");

    await ctx.db.patch(args.moduleId, {
      qaPairs: args.qaPairs,
      qaStatus: "ready",
      generationStatus: "ready",
      generationError: undefined,
    });

    const siblingModules = await ctx.db
      .query("learning_path_modules")
      .withIndex("by_learning_path_id", (q) => q.eq("learningPathId", learningModule.learningPathId))
      .order("asc")
      .collect();

    const allReady = siblingModules.every(
      (module) => module._id === learningModule._id || module.generationStatus === "ready",
    );

    await ctx.db.patch(path._id, {
      generationStatus: allReady ? "ready" : "generating",
      currentGeneratingModuleId: undefined,
      generationError: undefined,
    });
  },
});

export const failModuleGeneration = mutation({
  args: {
    pathId: v.id("learning_paths"),
    moduleId: v.id("learning_path_modules"),
    stage: v.union(v.literal("notes"), v.literal("video"), v.literal("qa")),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    const employee = await getCurrentEmployeeRecord(ctx, { requireIdentity: true });
    if (!employee) throw new Error("Unauthorized");

    const learningModule = await ctx.db.get(args.moduleId);
    const path = await ctx.db.get(args.pathId);
    if (!learningModule || !path || path.employeeId !== employee._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.moduleId, {
      generationStatus: "failed",
      generationError: args.error.slice(0, 1200),
      notesStatus: args.stage === "notes" ? "failed" : learningModule.notesStatus,
      videoStatus: args.stage === "video" ? "failed" : learningModule.videoStatus,
      qaStatus: args.stage === "qa" ? "failed" : learningModule.qaStatus,
    });

    await ctx.db.patch(path._id, {
      generationStatus: "generating",
      currentGeneratingModuleId: undefined,
      generationError: args.error.slice(0, 1200),
    });
  },
});

export const startModule = mutation({
  args: { moduleId: v.id("learning_path_modules") },
  handler: async (ctx, args) => {
    const employee = await getCurrentEmployeeRecord(ctx, { requireIdentity: true });
    if (!employee) throw new Error("Unauthorized");

    const learningModule = await ctx.db.get(args.moduleId);
    if (!learningModule) throw new Error("Module not found.");

    const path = await ctx.db.get(learningModule.learningPathId);
    if (!path || path.employeeId !== employee._id) {
      throw new Error("Unauthorized");
    }

    if (learningModule.status !== "not_started") return;
    await ctx.db.patch(args.moduleId, { status: "in_progress" });
  },
});

export const completeModule = mutation({
  args: { moduleId: v.id("learning_path_modules") },
  handler: async (ctx, args) => {
    const employee = await getCurrentEmployeeRecord(ctx, { requireIdentity: true });
    if (!employee) throw new Error("Unauthorized");

    const learningModule = await ctx.db.get(args.moduleId);
    if (!learningModule) throw new Error("Module not found.");

    const path = await ctx.db.get(learningModule.learningPathId);
    if (!path || path.employeeId !== employee._id) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.moduleId, { status: "completed", completedAt: Date.now() });
  },
});

export const deleteLatestLearningPathForEmployee = mutation({
  args: {},
  handler: async (ctx) => {
    const employee = await getCurrentEmployeeRecord(ctx, { requireIdentity: true });
    if (!employee) throw new Error("Unauthorized");

    const latestPath = await ctx.db
      .query("learning_paths")
      .withIndex("by_employee_id", (q) => q.eq("employeeId", employee._id))
      .order("desc")
      .first();

    if (!latestPath) {
      return { deleted: false };
    }

    const modules = await ctx.db
      .query("learning_path_modules")
      .withIndex("by_learning_path_id", (q) => q.eq("learningPathId", latestPath._id))
      .order("asc")
      .collect();

    for (const learningModule of modules) {
      await ctx.db.delete(learningModule._id);
    }

    if (latestPath.sourceResumeId) {
      const resume = await ctx.db.get(latestPath.sourceResumeId);
      if (resume) {
        await ctx.db.delete(resume._id);
      }
    }

    await ctx.db.delete(latestPath._id);

    return {
      deleted: true,
      deletedModules: modules.length,
      deletedPathId: latestPath._id,
    };
  },
});
