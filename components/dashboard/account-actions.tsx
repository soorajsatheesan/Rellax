"use server";

import { signOut, withAuth } from "@workos-inc/authkit-nextjs";
import { WorkOS } from "@workos-inc/node";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { createAuthenticatedConvexClient } from "@/lib/convex-server";

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export async function signOutEmployerAction() {
  const cookieStore = await cookies();
  cookieStore.delete("rellax_company_name");

  await signOut({ returnTo: "/signup" });
}

export async function signOutEmployeeAction() {
  const cookieStore = await cookies();
  cookieStore.delete("rellax_company_name");

  await signOut({ returnTo: "/login?view=employee" });
}

export async function deleteAccountAction() {
  const auth = await withAuth({ ensureSignedIn: true });
  const convex = createAuthenticatedConvexClient(auth.accessToken);
  const workspace = await convex.query(api.employers.getCurrentEmployerWorkspace, {});

  for (const employee of workspace?.employees ?? []) {
    await workos.userManagement.deleteUser(employee.workOSUserId);
  }

  await convex.mutation(api.employers.deleteCurrentEmployerWorkspace, {});

  await workos.userManagement.deleteUser(auth.user.id);

  const cookieStore = await cookies();
  cookieStore.delete("wos-session");
  cookieStore.delete("rellax_company_name");

  redirect("/signup");
}
