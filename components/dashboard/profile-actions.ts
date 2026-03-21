"use server";

import { revalidatePath } from "next/cache";
import { withAuth } from "@workos-inc/authkit-nextjs";

import { api } from "@/convex/_generated/api";
import { createAuthenticatedConvexClient } from "@/lib/convex-server";

export type ProfileActionState = {
  error?: string;
  success?: string;
};

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function updateEmployerProfileAction(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const companyName = readString(formData, "companyName");
  const ownerName = readString(formData, "ownerName");
  const ownerRole = readString(formData, "ownerRole");
  const companyLogoUrl = readString(formData, "companyLogoUrl");
  const companyWebsite = readString(formData, "companyWebsite");
  const industry = readString(formData, "industry");
  const companySize = readString(formData, "companySize");
  const headquarters = readString(formData, "headquarters");
  const aboutCompany = readString(formData, "aboutCompany");

  if (!companyName || !ownerName || !ownerRole) {
    return { error: "Company name, owner name, and owner role are required." };
  }

  if (companyWebsite && !isValidUrl(companyWebsite)) {
    return { error: "Enter a valid website URL including http:// or https://." };
  }

  if (companyLogoUrl && !companyLogoUrl.startsWith("data:image/") && !isValidUrl(companyLogoUrl)) {
    return { error: "Use a valid logo image URL or upload an image file." };
  }

  if (aboutCompany.length > 600) {
    return { error: "Keep the company overview under 600 characters." };
  }

  const auth = await withAuth({ ensureSignedIn: true });
  const convex = createAuthenticatedConvexClient(auth.accessToken);
  const currentEmployer = await convex.query(api.employers.getCurrentEmployer, {});

  if (!currentEmployer) {
    return { error: "Complete company onboarding before editing your profile." };
  }

  await convex.mutation(api.employers.upsertCurrentEmployer, {
    companyName,
    ownerEmail: currentEmployer.ownerEmail,
    ownerName,
    ownerRole,
    authProvider: currentEmployer.authProvider,
    companyLogoUrl,
    companyWebsite,
    industry,
    companySize,
    headquarters,
    aboutCompany,
  });

  revalidatePath("/dashboard");

  return { success: "Company profile updated." };
}
