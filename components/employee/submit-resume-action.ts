"use server";

import { withAuth } from "@workos-inc/authkit-nextjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { createAuthenticatedConvexClient } from "@/lib/convex-server";
import { extractTextFromResumeFile } from "@/lib/extract-resume-text";
import {
  generateAdaptiveRoadmap,
  generationVersion,
} from "@/lib/content-engine";
import { extractSkillsFromResume } from "@/lib/resume-skills-xai";

export type SubmitResumeState = { error?: string };

function toActionErrorMessage(error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;

  if (message.includes("ArgumentValidationError")) {
    return "The Convex backend is still using the old validator. Restart or rerun `npx convex dev --once` so the updated employeeLearning mutation is pushed, then submit again.";
  }

  return message || fallback;
}

async function getBaseUrl() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const proto = requestHeaders.get("x-forwarded-proto") ?? "http";

  if (!host) {
    throw new Error("Unable to determine request host.");
  }

  return `${proto}://${host}`;
}

export async function submitResumeAction(
  _prev: SubmitResumeState,
  formData: FormData,
): Promise<SubmitResumeState> {
  const auth = await withAuth({ ensureSignedIn: true });
  if (!auth.user) redirect("/login?view=employee");

  const resumeFile = formData.get("resumeFile") as File | null;
  const resumePaste = (formData.get("resumeText") as string)?.trim() ?? "";

  let resumeText: string;

  if (resumeFile && resumeFile instanceof File && resumeFile.size > 0) {
    try {
      resumeText = await extractTextFromResumeFile(resumeFile);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to read the document.";
      return { error: msg };
    }
  } else if (resumePaste.length >= 50) {
    resumeText = resumePaste;
  } else {
    return { error: "Upload a .docx or .pdf resume, or paste at least 50 characters of text." };
  }

  const convex = createAuthenticatedConvexClient(auth.accessToken);
  const profile = await convex.query(api.employees.getCurrentEmployeeProfile, {});

  if (!profile?.employee || !profile.employer) {
    return { error: "Employee profile not found." };
  }

  const { employee, employer } = profile;

  let extractedSkills: string[];
  try {
    extractedSkills = await extractSkillsFromResume(resumeText);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Skill extraction failed.";
    return { error: msg };
  }

  const roleReq = await convex.query(
    api.roleRequirements.getRoleRequirementsByEmployerAndRole,
    {
      employerId: employer._id as Id<"employers">,
      roleTitle: employee.roleTitle,
    },
  );

  const requiredSkills = new Set(
    (roleReq?.requiredSkills ?? []).map((s) => s.trim().toLowerCase()),
  );
  const existingSet = new Set(extractedSkills);
  const gapSkills = [...requiredSkills].filter((s) => !existingSet.has(s));
  const requiredSkillList = [...requiredSkills];

  let generatedRoadmap;
  try {
    generatedRoadmap = await generateAdaptiveRoadmap({
      employeeName: employee.fullName,
      roleTitle: employee.roleTitle,
      companyName: employer.companyName,
      resumeText,
      extractedSkills,
      requiredSkills: requiredSkillList,
      gapSkills,
    });
  } catch (err) {
    return {
      error: toActionErrorMessage(err, "Rellax AI roadmap generation failed."),
    };
  }

  let pathId: Id<"learning_paths">;
  try {
    const created = await convex.mutation(api.employeeLearning.insertResumeAndRoadmap, {
      resumeText,
      extractedSkills,
      requiredSkills: requiredSkillList,
      gapSkills,
      learnerPersonaSummary: generatedRoadmap.learnerPersonaSummary,
      generationVersion: generationVersion(),
      roadmapModules: generatedRoadmap.modules.map((module) => ({
        title: module.title,
        category: module.category,
        summary: module.summary,
        targetSkill: module.targetSkill,
        personalizationNote: module.personalizationNote,
        difficulty: module.difficulty,
        estimatedMinutes: module.estimatedMinutes,
        learningObjectives: module.learningObjectives,
      })),
    });
    pathId = created.pathId;
  } catch (err) {
    return { error: toActionErrorMessage(err, "Failed to save learning path.") };
  }

  try {
    const baseUrl = await getBaseUrl();
    void fetch(`${baseUrl}/api/learning/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: (await headers()).get("cookie") ?? "",
      },
      body: JSON.stringify({ pathId }),
      cache: "no-store",
    });
  } catch {
    // Roadmap page will retry generation orchestration on load.
  }

  redirect("/employee/roadmap");
}
