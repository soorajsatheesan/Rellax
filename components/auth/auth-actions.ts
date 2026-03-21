"use server";

import { saveSession } from "@workos-inc/authkit-nextjs";
import { WorkOS } from "@workos-inc/node";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { createAuthenticatedConvexClient } from "@/lib/convex-server";

export type AuthActionState = {
  error?: string;
};

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

function getAppUrl() {
  const redirectUri = process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI;

  if (redirectUri) {
    return redirectUri.replace(/\/callback$/, "");
  }

  return "http://localhost:3000";
}

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getAuthProviderFromEmail(email: string) {
  const domain = email.split("@")[1]?.toLowerCase();

  if (domain === "gmail.com") {
    return "google" as const;
  }

  if (
    domain === "outlook.com" ||
    domain === "hotmail.com" ||
    domain === "live.com"
  ) {
    return "outlook" as const;
  }

  return "password" as const;
}

function getWorkOSErrorMessage(error: unknown, mode: "sign-in" | "sign-up") {
  const message =
    error instanceof Error ? error.message.toLowerCase() : "unknown_error";

  if (message.includes("sso_required")) {
    return mode === "sign-up"
      ? "This email domain must use Google or Outlook instead of a password."
      : "This email domain must sign in with Google or Outlook.";
  }

  if (message.includes("already") || message.includes("exists")) {
    return "That email is already in use.";
  }

  if (message.includes("email_verification_required")) {
    return "Verify your email before trying to sign in.";
  }

  if (message.includes("email ownership must be verified")) {
    return "Check your inbox and verify your email before signing in.";
  }

  if (
    message.includes("invalid_grant") ||
    message.includes("invalid email or password")
  ) {
    return "Invalid email or password.";
  }

  return mode === "sign-up"
    ? "Unable to create your account right now."
    : "Unable to sign you in right now.";
}

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const companyName = readString(formData, "companyName");
  const email = readString(formData, "email").toLowerCase();
  const password = readString(formData, "password");
  const acceptedTerms = formData.get("terms") === "on";

  if (!companyName || !email || !password) {
    return { error: "Fill in all required fields." };
  }

  if (!isValidEmail(email)) {
    return { error: "Enter a valid work email address." };
  }

  if (password.length < 8) {
    return { error: "Use a password with at least 8 characters." };
  }

  if (!acceptedTerms) {
    return { error: "You need to accept the terms to continue." };
  }

  try {
    const createdUser = await workos.userManagement.createUser({
      email,
      password,
      metadata: {
        companyName,
      },
    });

    try {
      await workos.userManagement.sendVerificationEmail({
        userId: createdUser.id,
      });

      const cookieStore = await cookies();
      cookieStore.set("rellax_company_name", companyName, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });
    } catch (error) {
      await workos.userManagement.deleteUser(createdUser.id);
      return { error: getWorkOSErrorMessage(error, "sign-up") };
    }
  } catch (error) {
    return { error: getWorkOSErrorMessage(error, "sign-up") };
  }

  redirect(`/verify-email?email=${encodeURIComponent(email)}`);
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readString(formData, "email").toLowerCase();
  const password = readString(formData, "password");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  if (!isValidEmail(email)) {
    return { error: "Enter a valid email address." };
  }

  try {
    const authResponse = await workos.userManagement.authenticateWithPassword({
      clientId: process.env.WORKOS_CLIENT_ID!,
      email,
      password,
    });

    const companyName =
      typeof authResponse.user?.metadata?.companyName === "string"
        ? authResponse.user.metadata.companyName.trim()
        : "";

    if (companyName) {
      const convex = createAuthenticatedConvexClient(authResponse.accessToken);

      await convex.mutation(api.employers.upsertCurrentEmployer, {
        companyName,
        ownerEmail: authResponse.user.email,
        authProvider: getAuthProviderFromEmail(email),
      });

      const cookieStore = await cookies();
      cookieStore.set("rellax_company_name", companyName, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
      });
    }

    await saveSession(authResponse, getAppUrl());
  } catch (error) {
    return { error: getWorkOSErrorMessage(error, "sign-in") };
  }

  redirect("/dashboard");
}

export async function signInEmployeeAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readString(formData, "email").toLowerCase();
  const password = readString(formData, "password");

  if (!email || !password) {
    return { error: "Enter your work email and password." };
  }

  if (!isValidEmail(email)) {
    return { error: "Enter a valid email address." };
  }

  try {
    const authResponse = await workos.userManagement.authenticateWithPassword({
      clientId: process.env.WORKOS_CLIENT_ID!,
      email,
      password,
    });

    const convex = createAuthenticatedConvexClient(authResponse.accessToken);
    const employeeProfile = await convex.query(api.employees.getCurrentEmployeeProfile, {});

    if (!employeeProfile?.employee) {
      return { error: "No employee account found for this email. Contact your employer." };
    }

    await saveSession(authResponse, getAppUrl());
  } catch (error) {
    return { error: getWorkOSErrorMessage(error, "sign-in") };
  }

  redirect("/employee/dashboard");
}
