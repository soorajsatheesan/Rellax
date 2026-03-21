"use server";

import { withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { createAuthenticatedConvexClient } from "@/lib/convex-server";
import { extractTextFromResumeFile } from "@/lib/extract-resume-text";
import { extractSkillsFromResume } from "@/lib/resume-skills-xai";

export type SubmitResumeState = { error?: string };

/** MVP: generate modules from gap skills. Each gap becomes a "Learn X" module. */
function generateModuleSpecs(
  gapSkills: string[],
  employeeRoleTitle: string,
): Array<{ title: string; category: string; duration: string; lessons: number }> {
  if (gapSkills.length === 0) {
    return [
      {
        title: `${employeeRoleTitle} fundamentals`,
        category: "Onboarding",
        duration: "30 min",
        lessons: 3,
      },
      {
        title: "Company policies & compliance",
        category: "Compliance",
        duration: "20 min",
        lessons: 2,
      },
    ];
  }

  const category = "Skills";
  return gapSkills.slice(0, 12).map((skill) => ({
    title: `Learn ${skill.charAt(0).toUpperCase() + skill.slice(1)}`,
    category,
    duration: "25 min",
    lessons: 3,
  }));
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

  const moduleSpecs = generateModuleSpecs(gapSkills, employee.roleTitle);

  try {
    await convex.mutation(api.employeeLearning.insertResumeAndLearningPath, {
      resumeText,
      extractedSkills,
      moduleSpecs,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to save learning path.";
    return { error: msg };
  }

  redirect("/employee/roadmap");
}
