import { withAuth } from "@workos-inc/authkit-nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { BrandLogo } from "@/components/global/brand-logo";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { signOutEmployeeAction } from "@/components/dashboard/account-actions";
import { createAuthenticatedConvexClient } from "@/lib/convex-server";
import { RoadmapContent } from "@/components/employee/roadmap-content";

export default async function RoadmapPage() {
  const auth = await withAuth();

  if (!auth.user) {
    redirect("/login?view=employee");
  }

  const convex = createAuthenticatedConvexClient(auth.accessToken);
  const employeeProfile = await convex.query(
    api.employees.getCurrentEmployeeProfile,
    {},
  );

  if (!employeeProfile?.employee || !employeeProfile.employer) {
    redirect("/login?view=employee");
  }

  const { employer: company } = employeeProfile;

  // Fetch learning path on server to avoid client-side auth timing after redirect
  const learningPath = await convex.query(
    api.employeeLearning.getLearningPathForEmployee,
    {},
  );

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
              href="/employee/dashboard"
              className="rounded-full px-4 py-1.5 text-xs font-medium transition"
              style={{
                border: "1px solid var(--db-border)",
                color: "var(--db-text-soft)",
                background: "transparent",
                textDecoration: "none",
              }}
            >
              Dashboard
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

      <main className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
        <h1
          className="font-display text-3xl"
          style={{ color: "var(--db-text)" }}
        >
          Your learning path
        </h1>
        <p
          className="mt-2 text-sm leading-7"
          style={{ color: "var(--db-text-soft)" }}
        >
          Skills-based modules to close gaps for your role.
        </p>

        <div className="mt-8">
          <RoadmapContent
            companyName={company.companyName}
            serverLearningPath={learningPath}
          />
        </div>
      </main>
    </div>
  );
}
