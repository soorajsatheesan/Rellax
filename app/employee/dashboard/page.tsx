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
            <div
              className="flex size-8 items-center justify-center rounded-full font-mono text-[0.65rem] font-bold text-white"
              style={{ background: "var(--rellax-sage)" }}
            >
              {initials}
            </div>
            <ThemeToggle />
            <Link
              href="/employee/change-password"
              className="rounded-full px-4 py-1.5 text-xs font-medium transition"
              style={{
                border: "1px solid var(--db-border)",
                color: "var(--db-text-soft)",
                background: "transparent",
                textDecoration: "none",
              }}
            >
              Change password
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

      {/* Welcome hero — always dark */}
      <div style={{ background: "#0f0f14" }}>
        <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/50">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                Employee workspace
              </div>
              <h1 className="mt-4 font-display text-4xl text-white sm:text-5xl">
                Welcome back,{" "}
                <span style={{ color: "var(--rellax-sage)" }}>
                  {employee.fullName.split(" ")[0]}.
                </span>
              </h1>
              <p className="mt-3 text-sm leading-7 text-white/50">
                {employee.roleTitle} · {company.companyName}
              </p>
            </div>
            <DashboardHeroStats />
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
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p
                className="font-mono text-[0.62rem] uppercase tracking-[0.2em] font-semibold"
                style={{ color: "var(--db-text-muted)" }}
              >
                My learning
              </p>
              <h2
                className="mt-1 font-display text-2xl"
                style={{ color: "var(--db-text)" }}
              >
                Assigned modules
              </h2>
            </div>
          </div>

          <DashboardModules companyName={company.companyName} />
        </section>

        {/* Announcement */}
        <section className="mt-8">
          <div
            className="rounded-[1.5rem] p-6"
            style={{
              background: "var(--db-card)",
              border: "1px solid var(--db-border)",
              boxShadow: "var(--db-shadow-sm)",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-full text-white"
                style={{ background: "var(--rellax-sage)" }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M8 3v5M8 10v1M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <p
                  className="font-mono text-[0.62rem] uppercase tracking-[0.2em]"
                  style={{ color: "var(--db-text-muted)" }}
                >
                  Getting started
                </p>
                <h3
                  className="mt-1 text-base font-semibold"
                  style={{ color: "var(--db-text)" }}
                >
                  Your learning modules are ready
                </h3>
                <p
                  className="mt-2 text-sm leading-7"
                  style={{ color: "var(--db-text-soft)" }}
                >
                  Complete the assigned compliance and onboarding modules above to get fully set up
                  at {company.companyName}. Your progress is tracked automatically.
                </p>
              </div>
            </div>
          </div>
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
        boxShadow: "var(--db-shadow-sm)",
      }}
    >
      <p
        className="font-mono text-[0.6rem] uppercase tracking-[0.2em] font-semibold"
        style={{ color: "var(--db-text-muted)" }}
      >
        {label}
      </p>
      <p
        className={[
          "mt-2 truncate text-sm font-semibold",
          mono ? "font-mono" : "",
        ].join(" ")}
        style={{ color: "var(--db-text)" }}
      >
        {value}
      </p>
    </div>
  );
}

