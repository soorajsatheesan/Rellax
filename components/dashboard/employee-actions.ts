"use server";

import { withAuth } from "@workos-inc/authkit-nextjs";
import { WorkOS } from "@workos-inc/node";
import { revalidatePath } from "next/cache";

import { api } from "@/convex/_generated/api";
import { createAuthenticatedConvexClient } from "@/lib/convex-server";

export type EmployeeActionState = {
  error?: string;
  success?: string;
  credentials?: {
    employeeId: string;
    password: string;
  };
};

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidEmployeeId(employeeId: string) {
  return /^[a-zA-Z0-9_-]{4,32}$/.test(employeeId);
}

function generateStrongPassword(length = 14) {
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

export async function createEmployeeAction(
  _prevState: EmployeeActionState,
  formData: FormData,
): Promise<EmployeeActionState> {
  const employeeId = readString(formData, "employeeId");
  const fullName = readString(formData, "fullName");
  const roleTitle = readString(formData, "roleTitle");
  const email = readString(formData, "email").toLowerCase();
  const password = generateStrongPassword();

  if (!employeeId || !fullName || !roleTitle || !email) {
    return { error: "Fill in the employee ID, name, role, and email." };
  }

  if (!isValidEmployeeId(employeeId)) {
    return {
      error:
        "Use an employee ID with 4 to 32 letters, numbers, hyphens, or underscores.",
    };
  }

  if (!isValidEmail(email)) {
    return { error: "Enter a valid employee email address." };
  }

  const auth = await withAuth({ ensureSignedIn: true });
  const convex = createAuthenticatedConvexClient(auth.accessToken);
  const workspace = await convex.query(api.employers.getCurrentEmployerWorkspace, {});

  if (!workspace?.employer) {
    return { error: "Complete company setup before creating employee accounts." };
  }

  let createdUserId: string | null = null;

  try {
    const user = await workos.userManagement.createUser({
      email,
      password,
      emailVerified: true,
      externalId: employeeId,
      metadata: {
        accountType: "employee",
        employeeId,
        employerCompanyName: workspace.employer.companyName,
        employerOwnerWorkOSUserId: auth.user.id,
        fullName,
        roleTitle,
      },
    });
    createdUserId = user.id;

    await convex.mutation(api.employees.createEmployeeForCurrentEmployer, {
      employeeId,
      workOSUserId: user.id,
      email,
      fullName,
      roleTitle,
    });
  } catch (error) {
    if (createdUserId) {
      await workos.userManagement.deleteUser(createdUserId);
    }

    const message = error instanceof Error ? error.message.toLowerCase() : "";

    if (message.includes("external") || message.includes("employee id")) {
      return { error: "That employee ID is already in use." };
    }

    if (message.includes("already") || message.includes("exists")) {
      return { error: "That employee email is already in use." };
    }

    if (message.includes("password")) {
      return { error: "Unable to generate a password that satisfies the current policy." };
    }

    return {
      error:
        error instanceof Error ? error.message : "Unable to create the employee account right now.",
    };
  }

  revalidatePath("/dashboard");

  return {
    success: "Employee credentials created.",
    credentials: {
      employeeId,
      password,
    },
  };
}
