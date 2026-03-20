import { withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { deleteAccountAction } from "@/components/dashboard/account-actions";
import { EmployeeManagement } from "@/components/dashboard/employee-management";
import { EmployerSidebar } from "@/components/dashboard/employer-sidebar";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { createAuthenticatedConvexClient } from "@/lib/convex-server";

export default async function DashboardPage() {
  const auth = await withAuth();

  if (!auth.user) {
    redirect("/login");
  }

  const convex = createAuthenticatedConvexClient(auth.accessToken);
  const employeeProfile = await convex.query(api.employees.getCurrentEmployeeProfile, {});

  if (employeeProfile?.employee) {
    redirect("/employee/dashboard");
  }

  const workspace = await convex.query(api.employers.getCurrentEmployerWorkspace, {});

  if (!workspace?.employer) {
    redirect("/onboarding");
  }

  const { employer, employees } = workspace;

  const activeCount = employees.filter((e) => e.status === "active").length;
  const uniqueRoles = new Set(employees.map((e) => e.roleTitle).filter(Boolean)).size;

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "var(--db-bg)" }}
    >
      <EmployerSidebar
        companyName={employer.companyName}
        ownerName={employer.ownerName}
        ownerRole={employer.ownerRole}
        ownerEmail={employer.ownerEmail ?? auth.user.email}
        activeItem="Team"
      />

      {/* Main — offset by sidebar */}
      <div className="ml-[220px] flex min-h-screen flex-1 flex-col">
        {/* Top header */}
        <header
          className="sticky top-0 z-10 flex h-14 items-center justify-between px-8"
          style={{
            background: "var(--db-header)",
            borderBottom: "1px solid var(--db-border)",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[0.62rem] uppercase tracking-[0.2em]"
              style={{ color: "var(--db-text-muted)" }}
            >
              Dashboard
            </span>
            <span style={{ color: "var(--db-text-muted)" }}>/</span>
            <span
              className="font-mono text-[0.62rem] uppercase tracking-[0.2em] font-semibold"
              style={{ color: "var(--db-text)" }}
            >
              Team
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] bg-emerald-500/10 text-emerald-600">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Live
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-8 py-8">
          {/* Page title */}
          <div className="mb-8">
            <h1
              className="font-display text-4xl"
              style={{ color: "var(--db-text)" }}
            >
              {employer.companyName}
            </h1>
            <p
              className="mt-2 text-sm leading-7"
              style={{ color: "var(--db-text-soft)" }}
            >
              Manage your team, issue credentials, and control the employee onboarding surface.
            </p>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total employees"
              value={String(employees.length)}
              sub="Credentials issued"
              accentColor="var(--rellax-ink)"
              accentBg="var(--db-surface)"
              accentText="var(--db-text)"
            />
            <StatCard
              label="Active"
              value={String(activeCount)}
              sub="Currently active"
              accentColor="var(--rellax-sage)"
              accentBg="rgba(61,107,79,0.12)"
              accentText="var(--rellax-sage)"
            />
            <StatCard
              label="Unique roles"
              value={String(uniqueRoles || "—")}
              sub="Distinct job titles"
              accentColor="var(--rellax-slate)"
              accentBg="rgba(45,79,114,0.12)"
              accentText="var(--rellax-slate)"
            />
            <StatCard
              label="Pending invite"
              value="0"
              sub="Awaiting first login"
              accentColor="var(--rellax-gold)"
              accentBg="rgba(156,122,60,0.12)"
              accentText="var(--rellax-gold)"
            />
          </div>

          {/* Employee management */}
          <EmployeeManagement
            employees={employees.map((employee) => ({
              _id: employee._id,
              employeeId: employee.employeeId,
              email: employee.email,
              fullName: employee.fullName,
              roleTitle: employee.roleTitle,
              status: employee.status,
            }))}
          />

          {/* Danger zone */}
          <div
            className="mt-8 rounded-[1.5rem] p-6"
            style={{
              background: "var(--db-card)",
              border: "1px solid rgba(220,38,38,0.20)",
              boxShadow: "var(--db-shadow-sm)",
            }}
          >
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-red-500">
              Danger zone
            </p>
            <div className="mt-4 flex items-center justify-between gap-6">
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--db-text)" }}
                >
                  Delete employer account
                </p>
                <p
                  className="mt-1 text-xs leading-6"
                  style={{ color: "var(--db-text-soft)" }}
                >
                  Permanently deletes your workspace, all employee accounts, and associated data.
                  This cannot be undone.
                </p>
              </div>
              <form action={deleteAccountAction}>
                <button
                  type="submit"
                  className="shrink-0 rounded-full px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  style={{ border: "1px solid rgba(220,38,38,0.30)" }}
                >
                  Delete account
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accentColor,
  accentBg,
  accentText,
}: {
  label: string;
  value: string;
  sub: string;
  accentColor: string;
  accentBg: string;
  accentText: string;
}) {
  return (
    <div
      className="rounded-[1.5rem] p-5"
      style={{
        background: "var(--db-card)",
        border: "1px solid var(--db-border)",
        boxShadow: "var(--db-shadow-sm)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <p
          className="font-mono text-[0.62rem] uppercase tracking-[0.18em] font-semibold"
          style={{ color: "var(--db-text-muted)" }}
        >
          {label}
        </p>
        <span
          className="inline-flex size-6 shrink-0 items-center justify-center rounded-full"
          style={{ background: accentBg }}
        >
          <span
            className="size-2 rounded-full"
            style={{ background: accentColor }}
          />
        </span>
      </div>
      <p
        className="mt-3 font-display text-4xl leading-none"
        style={{ color: accentText }}
      >
        {value}
      </p>
      <p
        className="mt-2 text-xs"
        style={{ color: "var(--db-text-muted)" }}
      >
        {sub}
      </p>
    </div>
  );
}
