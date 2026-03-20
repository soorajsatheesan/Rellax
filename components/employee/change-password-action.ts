"use server";

import { withAuth } from "@workos-inc/authkit-nextjs";
import { WorkOS } from "@workos-inc/node";

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export type ChangePasswordState = {
  error?: string;
  success?: string;
  passwordRequirements?: {
    summary: string;
    checks: Array<{
      label: string;
      ok: boolean;
    }>;
  };
};

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function looksLikeWrongCurrentPassword(message: string) {
  const m = message.toLowerCase();
  return (
    m.includes("invalid_grant") ||
    m.includes("invalid email or password") ||
    m.includes("wrong password") ||
    m.includes("incorrect password") ||
    m.includes("invalid password") ||
    m.includes("credential") ||
    m.includes("authentication")
  );
}

function getPasswordRequirementChecks(
  workosErrorMessage: string,
  newPassword: string,
  userEmail: string,
): ChangePasswordState["passwordRequirements"] {
  const m = workosErrorMessage.toLowerCase();

  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSymbol = /[^A-Za-z0-9]/.test(newPassword);
  // Align with the password strength we generate for employees on employer-side.
  // That generator uses a stronger minimum length than 8, which better matches WorkOS strength policies.
  const minLength = 14;
  const lengthOk = newPassword.length >= minLength;
  const noWhitespace = !/\s/.test(newPassword);

  const emailLower = userEmail.toLowerCase();
  const emailLocalPart = emailLower.split("@")[0] ?? "";
  const emailDomainPart = emailLower.split("@")[1] ?? "";
  const newPasswordLower = newPassword.toLowerCase();

  // WorkOS strength policies frequently reject passwords that contain
  // *substrings* from the user's email (local-part and/or domain), not just the
  // full token. We approximate by checking any substring of length >= 3.
  const containsAnySubstring = (password: string, token: string) => {
    const min = 3;
    if (!token || token.length < min) return false;
    for (let i = 0; i <= token.length - min; i++) {
      const sub = token.slice(i, i + min);
      if (password.includes(sub)) return true;
    }
    return false;
  };

  // Also split on non-alphanumeric to cover cases like "john.doe".
  const splitTokens = (s: string) =>
    s.split(/[^a-z0-9]+/).filter((t) => t && t.length >= 3);

  const localTokens = splitTokens(emailLocalPart);
  const domainTokens = splitTokens(emailDomainPart);
  const emailTokens = [...localTokens, ...domainTokens];

  const doesNotContainEmail = emailTokens.length
    ? emailTokens.every((t) => !containsAnySubstring(newPasswordLower, t))
    : true;

  const doesNotContainEmailLocal = localTokens.length
    ? localTokens.every((t) => !containsAnySubstring(newPasswordLower, t))
    : true;

  const includeLength =
    m.includes("length") || m.includes("character") || m.includes("8");
  const includeUpper = m.includes("uppercase") || m.includes("capital");
  const includeLower = m.includes("lowercase") || m.includes("lower-case");
  const includeNumber = m.includes("number") || m.includes("digit");
  const includeSymbol = m.includes("symbol") || m.includes("special");

  const looksLikeComplexPolicy =
    m.includes("complex") || m.includes("strength") || m.includes("require");

  const shouldIncludeAllComplexChecks = looksLikeComplexPolicy && !(includeUpper || includeLower || includeNumber || includeSymbol);

  const checks: Array<{ label: string; ok: boolean }> = [];

  if (includeLength || shouldIncludeAllComplexChecks) {
    checks.push({ label: `At least ${minLength} characters`, ok: lengthOk });
  }
  if (includeUpper || shouldIncludeAllComplexChecks) {
    checks.push({ label: "At least 1 uppercase letter", ok: hasUpper });
  }
  if (includeLower || shouldIncludeAllComplexChecks) {
    checks.push({ label: "At least 1 lowercase letter", ok: hasLower });
  }
  if (includeNumber || shouldIncludeAllComplexChecks) {
    checks.push({ label: "At least 1 number", ok: hasNumber });
  }
  if (includeSymbol || shouldIncludeAllComplexChecks) {
    checks.push({ label: "At least 1 symbol", ok: hasSymbol });
  }

  // Always show a couple of very common strength blockers.
  checks.push({ label: "No spaces or whitespace", ok: noWhitespace });
  if (emailLocalPart) {
    checks.push({ label: "Does not include your email name", ok: doesNotContainEmailLocal });
  }
  checks.push({ label: "Does not include your email", ok: doesNotContainEmail });

  // If we still couldn't infer, show at least a length baseline.
  if (checks.length === 0) {
    checks.push({ label: `At least ${minLength} characters`, ok: lengthOk });
  }

  return {
    summary:
      "WorkOS rejected your new password. Update it to satisfy the requirements below.",
    checks,
  };
}

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const currentPassword = readString(formData, "currentPassword");
  const newPassword = readString(formData, "newPassword");
  const confirmPassword = readString(formData, "confirmPassword");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Fill in all required fields." };
  }

  if (newPassword.length < 14) {
    return { error: "Use a password with at least 14 characters." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New password and confirm password must match." };
  }

  const auth = await withAuth({ ensureSignedIn: true });

  if (!auth.user?.id || !auth.user?.email) {
    return { error: "Unable to update password for this session." };
  }

  // 1) Verify current password
  try {
    await workos.userManagement.authenticateWithPassword({
      clientId: process.env.WORKOS_CLIENT_ID!,
      email: auth.user.email,
      password: currentPassword,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    console.error(
      "[rellax][change-password] current password verification failed:",
      message,
    );

    if (message && looksLikeWrongCurrentPassword(message)) {
      return { error: "Current password is incorrect." };
    }

    return { error: "Unable to verify current password. Please try again." };
  }

  // 2) Update password
  try {
    await workos.userManagement.updateUser({
      userId: auth.user.id,
      password: newPassword,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const lower = message.toLowerCase();
    console.error("[rellax][change-password] password update failed:", message);

    // Common WorkOS failures: password policy / strength requirements.
    const looksLikePasswordPolicyIssue =
      lower.includes("password") &&
      (lower.includes("policy") ||
        lower.includes("require") ||
        lower.includes("strength") ||
        lower.includes("complex") ||
        lower.includes("length"));

    if (looksLikePasswordPolicyIssue) {
      const passwordRequirements = getPasswordRequirementChecks(
        message,
        newPassword,
        auth.user.email,
      );

      return {
        error: "Your new password does not meet the password requirements.",
        passwordRequirements,
      };
    }

    return { error: "Unable to update password right now. Please try again." };
  }

  // Best-effort: verification can fail immediately after update due to propagation.
  // Do not block success on this extra check.
  let verified = false;
  try {
    await workos.userManagement.authenticateWithPassword({
      clientId: process.env.WORKOS_CLIENT_ID!,
      email: auth.user.email,
      password: newPassword,
    });
    verified = true;
  } catch {
    // Intentionally ignore; user can verify by signing out/in.
  }

  return {
    success: verified
      ? "Password updated successfully."
      : "Password updated. Please sign out and sign in again to confirm.",
  };
}

