"use server";

import { withAuth } from "@workos-inc/authkit-nextjs";
import { revalidatePath } from "next/cache";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
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

export async function upsertRoleRequirementAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const roleTitle = readString(formData, "roleTitle");
  const skillsRaw = readString(formData, "requiredSkills");
  const roleId = readString(formData, "roleId") || undefined;
  const jdText = readString(formData, "jdText") || undefined;
  const jdFileUrl = readString(formData, "jdFileUrl") || undefined;

  if (!roleTitle) return { error: "Role title is required." };

  const requiredSkills = parseSkills(skillsRaw);
  if (requiredSkills.length === 0) {
    return { error: "Enter at least one required skill." };
  }

  try {
    const auth = await withAuth({ ensureSignedIn: true });
    const convex = createAuthenticatedConvexClient(auth.accessToken);

    await convex.mutation(api.roleRequirements.upsertRoleRequirement, {
      roleTitle,
      roleId,
      requiredSkills,
      jdText,
      jdFileUrl,
    });
  } catch (error) {
    console.error("upsertRoleRequirementAction error:", error);
    return { error: "Unable to save role requirement. Please try again." };
  }

  revalidatePath("/dashboard");
  return { success: "Role requirement saved." };
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
