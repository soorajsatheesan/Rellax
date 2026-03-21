"use server";

import { withAuth } from "@workos-inc/authkit-nextjs";
import { revalidatePath } from "next/cache";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { analyzeJobDescription } from "@/lib/openai";
import { createAuthenticatedConvexClient } from "@/lib/convex-server";

type ActionState = { error?: string; success?: string };

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/** Parse a comma-separated skills string into a cleaned, deduplicated array. */
function parseSkills(raw: string): string[] {
  return [
    ...new Set(
      raw
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}

function createRoleId(roleTitle: string) {
  return roleTitle
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function createRoleKey(roleTitle: string) {
  return roleTitle.trim().toLowerCase();
}

export async function upsertRoleRequirementAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const roleTitle = readString(formData, "roleTitle");
  const skillsRaw = readString(formData, "requiredSkills");
  const submittedRoleId = readString(formData, "roleId") || undefined;
  const jdText = readString(formData, "jdText") || undefined;
  const jdFileUrl = readString(formData, "jdFileUrl") || undefined;
  const jdFile = formData.get("jdFile");
  const uploadedFile =
    jdFile instanceof File && jdFile.size > 0 ? jdFile : null;

  if (!roleTitle) {
    return { error: "Role title is required." };
  }

  try {
    const auth = await withAuth({ ensureSignedIn: true });
    const convex = createAuthenticatedConvexClient(auth.accessToken);

    const analysis =
      jdText || uploadedFile
        ? await analyzeJobDescription({
            roleTitleHint: roleTitle || undefined,
            rawJdText: jdText,
            file: uploadedFile,
          })
        : null;

    const requiredSkills = analysis
      ? analysis.requiredSkills
      : parseSkills(skillsRaw);
    const effectiveRoleTitle = roleTitle;
    const effectiveRoleId = createRoleId(submittedRoleId || effectiveRoleTitle);
    const effectiveRoleKey = createRoleKey(effectiveRoleTitle);

    if (requiredSkills.length === 0) {
      return { error: "Enter at least one required skill or provide a JD to analyze." };
    }
    if (!effectiveRoleTitle) {
      return { error: "Role title is required." };
    }
    if (!effectiveRoleId) {
      return { error: "Unable to generate a role ID from the title." };
    }

    await convex.mutation(api.roleRequirements.upsertRoleRequirement, {
      roleTitle: effectiveRoleTitle,
      roleId: effectiveRoleId,
      roleKey: effectiveRoleKey,
      requiredSkills,
      preferredSkills: analysis?.preferredSkills,
      responsibilities: analysis?.responsibilities,
      qualifications: analysis?.qualifications,
      toolsAndTechnologies: analysis?.toolsAndTechnologies,
      roleSummary: analysis?.roleSummary,
      seniority: analysis?.seniority || undefined,
      sourceJdText: jdText,
      jdText: jdText,
      jdFileUrl: uploadedFile?.name || jdFileUrl,
    });
  } catch (error) {
    console.error("upsertRoleRequirementAction error:", error);
    return {
      error:
        error instanceof Error && error.message
          ? error.message
          : "Unable to save role requirement. Please try again.",
    };
  }

  revalidatePath("/dashboard");
  return {
    success:
      jdText || uploadedFile
        ? "Role requirement analyzed and saved."
        : "Role requirement saved.",
  };
}

export async function deleteRoleRequirementAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = readString(formData, "id");
  if (!id) return { error: "Missing ID." };

  try {
    const auth = await withAuth({ ensureSignedIn: true });
    const convex = createAuthenticatedConvexClient(auth.accessToken);

    await convex.mutation(api.roleRequirements.deleteRoleRequirement, {
      id: id as Id<"role_requirements">,
    });
  } catch (error) {
    console.error("deleteRoleRequirementAction error:", error);
    return { error: "Unable to delete role requirement." };
  }

  revalidatePath("/dashboard");
  return { success: "Deleted." };
}
