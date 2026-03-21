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

  const learningModule = await convex.query(api.employeeLearning.getModuleById, {
    moduleId: moduleId as Id<"learning_path_modules">,
  });

  if (!learningModule) notFound();

  const { employer: company } = employeeProfile;

  return (
    <div className="min-h-screen" style={{ background: "var(--db-bg)" }}>
      <header
        className="sticky top-0 z-20"
        style={{
          background: "color-mix(in srgb, var(--db-header) 92%, transparent)",
          borderBottom: "1px solid var(--db-border)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex h-14 w-full items-center justify-between px-6 sm:px-8">
          <BrandLogo tone="auto" />
          <div className="flex items-center gap-3">
            <span
              className="hidden font-mono text-[0.6rem] uppercase tracking-[0.2em] sm:block"
              style={{ color: "var(--db-text-muted)" }}
            >
              {company.companyName}
            </span>
            <ThemeToggle />
            <Link
              href="/employee/roadmap"
              className="db-nav-btn rounded-full px-4 py-1.5 text-xs font-medium"
              style={{
                border: "1px solid var(--db-border)",
                color: "var(--db-text-soft)",
                background: "var(--db-surface)",
                textDecoration: "none",
              }}
            >
              ← Roadmap
            </Link>
            <form action={signOutEmployeeAction}>
              <button
                type="submit"
                className="db-nav-btn rounded-full px-4 py-1.5 text-xs font-medium"
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

      <main className="w-full">
        <ModuleDetailContent module={learningModule} />
      </main>
    </div>
  );
}
