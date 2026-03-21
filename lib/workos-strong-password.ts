/**
 * Password shape aligned with employer-created employee accounts (see dashboard employee-actions).
 * WorkOS strength checks are stricter than a short checklist; this charset + length matches what we know passes.
 */
export function generateStrongPassword(length = 14): string {
  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
  const crypto = globalThis.crypto;

  if (!crypto) {
    throw new Error("Secure password generation is unavailable.");
  }

  const values = crypto.getRandomValues(new Uint32Array(length));
  let password = "";

  for (const value of values) {
    password += alphabet[value % alphabet.length];
  }

  return password;
}
