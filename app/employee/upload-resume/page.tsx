import { withAuth } from "@workos-inc/authkit-nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { BrandLogo } from "@/components/global/brand-logo";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { signOutEmployeeAction } from "@/components/dashboard/account-actions";
import { createAuthenticatedConvexClient } from "@/lib/convex-server";
import { UploadResumeForm } from "@/components/employee/upload-resume-form";

export default async function UploadResumePage() {
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
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 sm:px-8">
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
              href="/employee/dashboard"
              className="db-nav-btn rounded-full px-4 py-1.5 text-xs font-medium"
              style={{
                border: "1px solid var(--db-border)",
                color: "var(--db-text-soft)",
                background: "var(--db-surface)",
                textDecoration: "none",
              }}
            >
              ← Dashboard
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

      <main className="mx-auto max-w-2xl px-6 py-10 sm:px-8">
        <h1
          className="font-display text-3xl"
          style={{ color: "var(--db-text)", letterSpacing: "-0.02em" }}
        >
          Upload your resume
        </h1>
        <p
          className="mt-2 text-sm leading-[1.75]"
          style={{ color: "var(--db-text-soft)" }}
        >
          Upload your resume (.docx or .pdf) and we&apos;ll extract your skills, compare
          them to your role requirements, then generate narrated slide modules with
          downloadable PPT and transcript assets.
        </p>

        <div
          className="mt-8 rounded-[1.5rem] p-6"
          style={{
            background: "var(--db-card)",
            border: "1px solid var(--db-border)",
            boxShadow: "var(--db-shadow-md)",
          }}
        >
          <UploadResumeForm />
        </div>
      </main>
    </div>
  );
}
