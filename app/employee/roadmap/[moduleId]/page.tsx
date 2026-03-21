import { withAuth } from "@workos-inc/authkit-nextjs";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { BrandLogo } from "@/components/global/brand-logo";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { signOutEmployeeAction } from "@/components/dashboard/account-actions";
import { createAuthenticatedConvexClient } from "@/lib/convex-server";
import { ModuleDetailContent } from "@/components/employee/module-detail-content";

type Props = { params: Promise<{ moduleId: string }> };

export default async function ModuleDetailPage({ params }: Props) {
  const auth = await withAuth();
  if (!auth.user) redirect("/login?view=employee");

  const { moduleId } = await params;

  const convex = createAuthenticatedConvexClient(auth.accessToken);
  const employeeProfile = await convex.query(
    api.employees.getCurrentEmployeeProfile,
    {},
  );

  if (!employeeProfile?.employee || !employeeProfile.employer) {
    redirect("/login?view=employee");
  }

  const module = await convex.query(api.employeeLearning.getModuleById, {
    moduleId: moduleId as Id<"learning_path_modules">,
  });

  if (!module) notFound();

  const { employer: company } = employeeProfile;

  return (
    <div className="min-h-screen" style={{ background: "var(--db-bg)" }}>
      <header
        className="sticky top-0 z-20"
        style={{
          background: "var(--db-header)",
          borderBottom: "1px solid var(--db-border)",
        }}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 sm:px-8">
          <BrandLogo />
          <div className="flex items-center gap-4">
            <span
              className="hidden font-mono text-[0.62rem] uppercase tracking-[0.18em] sm:block"
              style={{ color: "var(--db-text-muted)" }}
            >
              {company.companyName}
            </span>
            <ThemeToggle />
            <Link
              href="/employee/roadmap"
              className="rounded-full px-4 py-1.5 text-xs font-medium transition"
              style={{
                border: "1px solid var(--db-border)",
                color: "var(--db-text-soft)",
                background: "transparent",
                textDecoration: "none",
              }}
            >
              ← Roadmap
            </Link>
            <form action={signOutEmployeeAction}>
              <button
                type="submit"
                className="rounded-full px-4 py-1.5 text-xs font-medium transition"
                style={{
                  border: "1px solid var(--db-border)",
                  color: "var(--db-text-soft)",
                  background: "transparent",
                }}
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 sm:px-8">
        <ModuleDetailContent module={module} />
      </main>
    </div>
  );
}
