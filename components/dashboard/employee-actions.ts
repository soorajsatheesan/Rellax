"use server";

import { withAuth } from "@workos-inc/authkit-nextjs";
import { WorkOS } from "@workos-inc/node";
import { revalidatePath } from "next/cache";
import * as XLSX from "xlsx";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { createAuthenticatedConvexClient } from "@/lib/convex-server";
import { generateStrongPassword } from "@/lib/workos-strong-password";

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

function getEmployeeMetadata(input: {
  employeeId: string;
  companyName: string;
  employerOwnerWorkOSUserId: string;
  fullName: string;
  roleTitle: string;
}) {
  return {
    accountType: "employee",
    employeeId: input.employeeId,
    employerCompanyName: input.companyName,
    employerOwnerWorkOSUserId: input.employerOwnerWorkOSUserId,
    fullName: input.fullName,
    roleTitle: input.roleTitle,
  };
}

function extractErrorText(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  if (error && typeof error === "object") {
    const candidate = error as {
      message?: unknown;
      code?: unknown;
      errors?: unknown;
      rawData?: unknown;
      cause?: unknown;
    };

    if (typeof candidate.message === "string" && candidate.message.trim()) {
      return candidate.message.trim();
    }

    if (Array.isArray(candidate.errors) && candidate.errors.length > 0) {
      const nested = candidate.errors
        .map((entry) => extractErrorText(entry))
        .find(Boolean);

      if (nested) {
        return nested;
      }
    }

    if (candidate.rawData) {
      const nested = extractErrorText(candidate.rawData);
      if (nested) {
        return nested;
      }
    }

    if (candidate.cause) {
      const nested = extractErrorText(candidate.cause);
      if (nested) {
        return nested;
      }
    }

    if (typeof candidate.code === "string" && candidate.code.trim()) {
      return candidate.code.trim();
    }
  }

  return "";
}

async function findExistingWorkOSUser(email: string, employeeId: string) {
  const [userByExternalId, usersByEmail] = await Promise.all([
    workos.userManagement
      .getUserByExternalId(employeeId)
      .catch(() => null),
    workos.userManagement.listUsers({ email }).catch(() => null),
  ]);

  const userByEmail = usersByEmail
    ? (await usersByEmail.data)[0] ?? null
    : null;

  if (
    userByExternalId &&
    userByEmail &&
    userByExternalId.id !== userByEmail.id
  ) {
    throw new Error("Employee email and ID belong to different existing users.");
  }

  return userByExternalId ?? userByEmail;
}

export async function createEmployeeAction(
  _prevState: EmployeeActionState,
  formData: FormData,
): Promise<EmployeeActionState> {
  const employeeId = readString(formData, "employeeId");
  const fullName = readString(formData, "fullName");
  const submittedRoleTitle = readString(formData, "roleTitle");
  const submittedRoleId = readString(formData, "roleId");
  const email = readString(formData, "email").toLowerCase();
  const password = generateStrongPassword();

  if (!employeeId || !fullName || !submittedRoleTitle || !email) {
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
  const availableRoles = await convex.query(
    api.roleRequirements.getRoleRequirementsForEmployer,
    {},
  );

  if (!workspace?.employer) {
    return { error: "Complete company setup before creating employee accounts." };
  }

  const selectedRole = availableRoles.find(
    (role) =>
      role.roleId === submittedRoleId &&
      role.roleTitle === submittedRoleTitle,
  );
  if (!selectedRole) {
    return { error: "Select a valid role from role management before creating an employee." };
  }
  const roleTitle = selectedRole.roleTitle;
  const roleId = selectedRole.roleId;

  const duplicate = workspace.employees.some(
    (e) => e.email.toLowerCase() === email,
  );
  if (duplicate) {
    return { error: "An employee with that email already exists." };
  }

  const duplicateEmployeeId = workspace.employees.some(
    (e) => e.employeeId.toLowerCase() === employeeId.toLowerCase(),
  );
  if (duplicateEmployeeId) {
    return { error: "An employee with that ID already exists." };
  }

  let createdUserId: string | null = null;

  try {
    const metadata = getEmployeeMetadata({
      employeeId,
      companyName: workspace.employer.companyName,
      employerOwnerWorkOSUserId: workspace.employer.ownerWorkOSUserId,
      fullName,
      roleTitle,
    });
    const existingUser = await findExistingWorkOSUser(email, employeeId);
    const user = existingUser
      ? await workos.userManagement.updateUser({
          userId: existingUser.id,
          email,
          password,
          emailVerified: true,
          externalId: employeeId,
          metadata,
        })
      : await workos.userManagement.createUser({
          email,
          password,
          emailVerified: true,
          externalId: employeeId,
          metadata,
        });
    createdUserId = user.id;

    await convex.mutation(api.employees.createEmployeeForCurrentEmployer, {
      employeeId,
      workOSUserId: user.id,
      email,
      fullName,
      roleId,
      roleTitle,
    });
  } catch (error) {
    if (createdUserId) {
      await workos.userManagement.deleteUser(createdUserId).catch(() => null);
    }

    const rawMessage = extractErrorText(error);
    const message = rawMessage.toLowerCase();

    console.error("createEmployeeAction failed", {
      employeeId,
      email,
      error,
      rawMessage,
    });

    if (message.includes("already") || message.includes("exists")) {
      return { error: "An employee with that email or ID already exists." };
    }

    if (message.includes("external") || message.includes("externalid")) {
      return { error: "That employee ID is already in use." };
    }

    if (message.includes("password")) {
      return { error: "Failed to generate a valid password. Please try again." };
    }

    if (rawMessage) {
      return { error: rawMessage };
    }

    return { error: "Failed to create employee. Please try again." };
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

export type BulkUploadResult = {
  successCount: number;
  failedCount: number;
  errors: { row: number; employeeId?: string; error: string }[];
};

export async function bulkCreateEmployeesAction(
  formData: FormData,
): Promise<BulkUploadResult> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { successCount: 0, failedCount: 0, errors: [{ row: 0, error: "No file provided." }] };
  }

  // Parse the file into rows using SheetJS (handles both CSV and xlsx)
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rawRows: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

  // Drop header row if first cell looks like a column name
  const firstCell = String(rawRows[0]?.[0] ?? "").toLowerCase();
  const dataRows = firstCell === "employeeid" || firstCell === "employee id" || firstCell === "employee_id"
    ? rawRows.slice(1)
    : rawRows;

  const nonEmptyRows = dataRows.filter((row) => row.some((cell) => String(cell).trim() !== ""));

  if (nonEmptyRows.length === 0) {
    return { successCount: 0, failedCount: 0, errors: [{ row: 0, error: "File contains no data rows." }] };
  }

  // Auth + workspace fetched once for the whole batch
  const auth = await withAuth({ ensureSignedIn: true });
  const convex = createAuthenticatedConvexClient(auth.accessToken);
  const workspace = await convex.query(api.employers.getCurrentEmployerWorkspace, {});

  if (!workspace?.employer) {
    return {
      successCount: 0,
      failedCount: nonEmptyRows.length,
      errors: [{ row: 0, error: "Complete company setup before creating employee accounts." }],
    };
  }

  const existingEmails = new Set(
    workspace.employees.map((e) => e.email.toLowerCase()),
  );
  const existingEmployeeIds = new Set(
    workspace.employees.map((e) => e.employeeId.toLowerCase()),
  );

  const results: BulkUploadResult = { successCount: 0, failedCount: 0, errors: [] };

  for (let i = 0; i < nonEmptyRows.length; i++) {
    const rowNum = i + 1;
    const [col0, col1, col2, col3] = nonEmptyRows[i];
    const employeeId = String(col0 ?? "").trim();
    const fullName   = String(col1 ?? "").trim();
    const roleTitle  = String(col2 ?? "").trim();
    const email      = String(col3 ?? "").trim().toLowerCase();

    if (!employeeId || !fullName || !roleTitle || !email) {
      results.failedCount++;
      results.errors.push({ row: rowNum, employeeId, error: "Missing required field(s)." });
      continue;
    }

    if (!isValidEmployeeId(employeeId)) {
      results.failedCount++;
      results.errors.push({ row: rowNum, employeeId, error: "Invalid employee ID format." });
      continue;
    }

    if (!isValidEmail(email)) {
      results.failedCount++;
      results.errors.push({ row: rowNum, employeeId, error: "Invalid email address." });
      continue;
    }

    if (existingEmails.has(email)) {
      results.failedCount++;
      results.errors.push({ row: rowNum, employeeId, error: "Email already exists." });
      continue;
    }

    if (existingEmployeeIds.has(employeeId.toLowerCase())) {
      results.failedCount++;
      results.errors.push({ row: rowNum, employeeId, error: "Employee ID already exists." });
      continue;
    }

    const password = generateStrongPassword();
    let createdUserId: string | null = null;

    try {
      const metadata = getEmployeeMetadata({
        employeeId,
        companyName: workspace.employer.companyName,
        employerOwnerWorkOSUserId: workspace.employer.ownerWorkOSUserId,
        fullName,
        roleTitle,
      });
      const existingUser = await findExistingWorkOSUser(email, employeeId);
      const user = existingUser
        ? await workos.userManagement.updateUser({
            userId: existingUser.id,
            email,
            password,
            emailVerified: true,
            externalId: employeeId,
            metadata,
          })
        : await workos.userManagement.createUser({
            email,
            password,
            emailVerified: true,
            externalId: employeeId,
            metadata,
          });
      createdUserId = user.id;

      await convex.mutation(api.employees.createEmployeeForCurrentEmployer, {
        employeeId,
        workOSUserId: user.id,
        email,
        fullName,
        roleTitle,
      });

      existingEmails.add(email);
      existingEmployeeIds.add(employeeId.toLowerCase());
      results.successCount++;
    } catch (error) {
      if (createdUserId) {
        await workos.userManagement.deleteUser(createdUserId).catch(() => null);
      }

      const rawMessage = extractErrorText(error);
      const message = rawMessage.toLowerCase();
      let reason = "Failed to create employee.";
      if (message.includes("already") || message.includes("exists")) reason = "Email or ID already in use.";
      else if (message.includes("external") || message.includes("externalid")) reason = "Employee ID already in use.";
      else if (rawMessage) reason = rawMessage;

      results.failedCount++;
      results.errors.push({ row: rowNum, employeeId, error: reason });
    }
  }

  if (results.successCount > 0) {
    revalidatePath("/dashboard");
  }

  return results;
}

export async function deleteEmployeeAction(
  convexEmployeeId: string,
): Promise<{ success?: boolean; error?: string }> {
  const auth = await withAuth({ ensureSignedIn: true });
  const convex = createAuthenticatedConvexClient(auth.accessToken);

  try {
    const workspace = await convex.query(
      api.employers.getCurrentEmployerWorkspace,
      {},
    );
    const employee = workspace?.employees.find((entry) => entry._id === convexEmployeeId);

    if (!employee) {
      return { error: "Employee not found." };
    }

    await workos.userManagement.deleteUser(employee.workOSUserId).catch(() => null);

    await convex.mutation(api.employees.deleteEmployee, {
      employeeId: convexEmployeeId as Id<"employees">,
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { error: "Unable to delete employee." };
  }
}
