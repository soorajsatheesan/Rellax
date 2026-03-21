import { withAuth } from "@workos-inc/authkit-nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { signOutEmployeeAction } from "@/components/dashboard/account-actions";
import { BrandLogo } from "@/components/global/brand-logo";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { createAuthenticatedConvexClient } from "@/lib/convex-server";
import { DashboardHeroStats } from "@/components/employee/dashboard-hero-stats";
import { DashboardModules } from "@/components/employee/dashboard-modules";

export default async function EmployeeDashboardPage() {
  const auth = await withAuth();

  if (!auth.user) {
    redirect("/login?view=employee");
  }

  const convex = createAuthenticatedConvexClient(auth.accessToken);
  const employer = await convex.query(api.employers.getCurrentEmployer, {});

  if (employer) {
    redirect("/dashboard");
  }

  const employeeProfile = await convex.query(api.employees.getCurrentEmployeeProfile, {});

  if (!employeeProfile?.employee || !employeeProfile.employer) {
    redirect("/login?view=employee");
  }

  const { employee, employer: company } = employeeProfile;

  const serverLearningPath = await convex.query(
    api.employeeLearning.getLearningPathForEmployee,
    {},
  );

  const initials = employee.fullName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen" style={{ background: "var(--db-bg)" }}>
      {/* Top nav */}
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
            <div
              className="flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-[0.62rem] font-bold text-white"
              style={{
                background: "var(--rellax-sage)",
                boxShadow: "0 0 0 2px color-mix(in srgb, var(--rellax-sage) 25%, transparent)",
              }}
            >
              {initials}
            </div>
            <ThemeToggle />
            <Link
              href="/employee/change-password"
              className="db-nav-btn rounded-full px-4 py-1.5 text-xs font-medium"
              style={{
                border: "1px solid var(--db-border)",
                color: "var(--db-text-soft)",
                background: "var(--db-surface)",
                textDecoration: "none",
              }}
            >
              Change password
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

      {/* Welcome hero — always dark */}
      <div
        style={{
          background: "linear-gradient(160deg, #0f0f16 0%, #0d1218 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3.5 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-white/55">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                Employee workspace
              </div>
              <h1
                className="mt-5 font-display text-4xl text-white sm:text-5xl"
                style={{ letterSpacing: "-0.02em" }}
              >
                Welcome back,{" "}
                <span style={{ color: "color-mix(in srgb, var(--rellax-sage) 90%, white 10%)" }}>
                  {employee.fullName.split(" ")[0]}.
                </span>
              </h1>
              <p className="mt-3 text-sm leading-7 text-white/60">
                {employee.roleTitle} · {company.companyName}
              </p>
            </div>
            <DashboardHeroStats serverLearningPath={serverLearningPath} />
          </div>
        </div>
      </div>

      {/* Body */}
      <main className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
        {/* Profile info row */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard label="Employee ID" value={employee.employeeId} mono />
          <InfoCard label="Email" value={employee.email} />
          <InfoCard label="Role" value={employee.roleTitle} />
          <InfoCard label="Company" value={company.companyName} />
        </div>

        {/* My learning */}
        <section>
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p
                className="font-mono text-[0.6rem] uppercase tracking-[0.22em] font-semibold"
                style={{ color: "var(--db-text-muted)" }}
              >
                My learning
              </p>
              <h2
                className="mt-1.5 font-display text-2xl"
                style={{ color: "var(--db-text)", letterSpacing: "-0.02em" }}
              >
                Assigned modules
              </h2>
            </div>
          </div>

          <DashboardModules
            serverLearningPath={serverLearningPath}
          />
        </section>
      </main>
    </div>
  );
}

function InfoCard({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div
      className="rounded-[1.25rem] p-4"
      style={{
        background: "var(--db-card)",
        border: "1px solid var(--db-border)",
        boxShadow: "var(--db-shadow-md)",
      }}
    >
      <p
        className="font-mono text-[0.58rem] uppercase tracking-[0.22em] font-semibold"
        style={{ color: "var(--db-text-muted)" }}
      >
        {label}
      </p>
      <p
        className={[
          "mt-2.5 truncate text-sm font-semibold",
          mono ? "font-mono" : "",
        ].join(" ")}
        style={{ color: "var(--db-text)" }}
      >
        {value}
      </p>
    </div>
  );
}
