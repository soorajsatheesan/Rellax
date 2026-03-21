import { withAuth } from "@workos-inc/authkit-nextjs";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { createAuthenticatedConvexClient } from "@/lib/convex-server";
import {
  generateModuleNotes,
  generateModuleQAPairs,
  generateModuleSlides,
  generateSlideScripts,
  type RoadmapModule,
} from "@/lib/content-engine";
import { buildLearningModuleAssets } from "@/lib/learning-asset-generator";

type GenerationRequest = {
  pathId?: Id<"learning_paths">;
};

function toMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export async function POST(request: Request) {
  const auth = await withAuth();
  if (!auth.user || !auth.accessToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { pathId } = (await request.json().catch(() => ({}))) as GenerationRequest;
  if (!pathId) {
    return Response.json({ error: "Missing pathId" }, { status: 400 });
  }

  const convex = createAuthenticatedConvexClient(auth.accessToken);
  const context = await convex.query(api.employeeLearning.getGenerationContext, { pathId });

  if (!context?.resume) {
    return Response.json({ error: "Learning path context not found." }, { status: 404 });
  }

  const claimedModuleId = await convex.mutation(api.employeeLearning.claimNextModuleForGeneration, {
    pathId,
  });

  if (!claimedModuleId) {
    return Response.json({ status: "ready" });
  }

  const moduleRecord = context.modules.find((module) => module._id === claimedModuleId);
  if (!moduleRecord) {
    return Response.json({ error: "Module not found." }, { status: 404 });
  }

  const generationInput = {
    employeeName: context.employee.fullName,
    roleTitle: context.employee.roleTitle,
    companyName: (context.employer as { companyName: string }).companyName,
    resumeText: context.resume.resumeText,
    extractedSkills: context.resume.extractedSkills,
    requiredSkills: context.path.requiredSkills ?? [],
    gapSkills: context.path.gapSkills ?? [],
  };

  const roadmapModule: RoadmapModule = {
    title: moduleRecord.title,
    category: moduleRecord.category,
    summary: moduleRecord.summary ?? "",
    targetSkill: moduleRecord.targetSkill ?? moduleRecord.title,
    personalizationNote: moduleRecord.personalizationNote ?? "",
    difficulty: moduleRecord.difficulty ?? "intermediate",
    estimatedMinutes: moduleRecord.estimatedMinutes ?? 20,
    learningObjectives: moduleRecord.learningObjectives ?? [],
  };

  try {
    let notesContent = moduleRecord.notesContent ?? "";
    let knowledgeChecks = moduleRecord.knowledgeChecks ?? [];
    let personalizationNote = moduleRecord.personalizationNote ?? roadmapModule.personalizationNote;
    let videoStyle = moduleRecord.videoStyle ?? "Narrated explainer";

    if (moduleRecord.notesStatus !== "ready") {
      const notes = await generateModuleNotes(generationInput, roadmapModule);
      notesContent = notes.notesContent;
      knowledgeChecks = notes.knowledgeChecks;
      personalizationNote = notes.personalizationNote;
      videoStyle = notes.videoStyle;

      await convex.mutation(api.employeeLearning.saveModuleNotes, {
        moduleId: claimedModuleId,
        notesContent,
        knowledgeChecks,
        personalizationNote,
        videoStyle,
      });
    }

    let slides = moduleRecord.slides ?? [];
    let narrationScript = moduleRecord.narrationScript ?? "";
    let duration = moduleRecord.duration;
    let slideDeckUrl = moduleRecord.slideDeckUrl ?? "";
    let transcriptUrl = moduleRecord.transcriptUrl ?? "";
    let artifactManifestUrl = moduleRecord.artifactManifestUrl ?? "";

    if (moduleRecord.videoStatus !== "ready") {
      const slideOutline = await generateModuleSlides(generationInput, roadmapModule, notesContent);
      const scriptedSlides = await generateSlideScripts(
        generationInput,
        roadmapModule,
        slideOutline,
        notesContent,
      );
      const builtModule = await buildLearningModuleAssets({
        employeeId: context.employee.employeeId,
        module: { ...roadmapModule, personalizationNote },
        notesContent,
        knowledgeChecks,
        videoStyle,
        slides: scriptedSlides,
        qaPairs: [],
      });

      slides = builtModule.slides;
      narrationScript = builtModule.narrationScript;
      duration = builtModule.duration;
      slideDeckUrl = builtModule.assets.slideDeckUrl;
      transcriptUrl = builtModule.assets.transcriptUrl;
      artifactManifestUrl = builtModule.assets.artifactManifestUrl;

      await convex.mutation(api.employeeLearning.saveModuleVideo, {
        moduleId: claimedModuleId,
        slides,
        narrationScript,
        duration,
        slideDeckUrl,
        transcriptUrl,
        artifactManifestUrl,
      });
    }

    if (moduleRecord.qaStatus !== "ready") {
      const qaPairs = await generateModuleQAPairs(generationInput, roadmapModule, notesContent);
      await convex.mutation(api.employeeLearning.saveModuleQa, {
        moduleId: claimedModuleId,
        qaPairs,
      });
    }

    return Response.json({
      status: "processed",
      moduleId: claimedModuleId,
      duration,
      slideDeckUrl,
      transcriptUrl,
      artifactManifestUrl,
      slidesGenerated: slides.length,
      narrationScriptLength: narrationScript.length,
    });
  } catch (error) {
    const message = toMessage(error, "Module generation failed.");
    const stage =
      moduleRecord.notesStatus !== "ready"
        ? "notes"
        : moduleRecord.videoStatus !== "ready"
        ? "video"
        : "qa";

    await convex.mutation(api.employeeLearning.failModuleGeneration, {
      pathId,
      moduleId: claimedModuleId,
      stage,
      error: message,
    });

    return Response.json({ error: message }, { status: 500 });
  }
}
