"use client";

import { useEffect, useState, useTransition } from "react";

import type { Id } from "@/convex/_generated/dataModel";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { EmployeeManagement } from "@/components/dashboard/employee-management";
import { EmployerProfile } from "@/components/dashboard/employer-profile";
import {
  EmployerSidebar,
  type DashboardSection,
} from "@/components/dashboard/employer-sidebar";
import {
  deleteRoleRequirementAction,
  upsertRoleRequirementAction,
} from "@/components/dashboard/role-requirement-actions";
import { RoleRequirements } from "@/components/dashboard/role-requirements";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";

const SECTIONS = {
  overview: {
    label: "Overview",
    title: "Company overview",
    description:
      "Track team health, onboarding momentum, and workspace readiness from one executive summary.",
  },
  employees: {
    label: "Employees",
    title: "Employee operations",
    description:
      "Create credentials, review progress, and manage the employee roster in one place.",
  },
  roles: {
    label: "Roles",
    title: "Role management",
    description:
      "Define role expectations and keep onboarding aligned with real job requirements.",
  },
  profile: {
    label: "Profile",
    title: "Company profile",
    description:
      "Maintain the company identity, operating details, and admin profile shown across the workspace.",
  },
} as const;

type EmployeeRecord = {
  _id: string;
  employeeId: string;
  email: string;
  fullName: string;
  roleTitle: string;
  status: "active";
  progressPercentage: number;
};

type RoleRecord = {
  _id: Id<"role_requirements">;
  roleTitle: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  responsibilities?: string[];
  qualifications?: string[];
  toolsAndTechnologies?: string[];
  roleSummary?: string;
  seniority?: string;
  sourceJdText?: string;
  updatedAt: number;
  roleId?: string;
  jdText?: string;
  jdFileUrl?: string;
};

type EmployerRecord = {
  companyName: string;
  companyLogoUrl?: string | null;
  companyWebsite?: string | null;
  industry?: string | null;
  companySize?: string | null;
  headquarters?: string | null;
  aboutCompany?: string | null;
  ownerEmail: string;
  ownerName?: string | null;
  ownerRole?: string | null;
};

type Props = {
  initialSection: DashboardSection;
  employer: EmployerRecord;
  employees: EmployeeRecord[];
  roles: RoleRecord[];
  activeCount: number;
  uniqueRoles: number;
  averageProgress: number;
};

export function DashboardShell({
  initialSection,
  employer,
  employees,
  roles,
  activeCount,
  uniqueRoles,
  averageProgress,
}: Props) {
  const [section, setSection] = useState<DashboardSection>(initialSection);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setSection(initialSection);
  }, [initialSection]);

  function handleSectionChange(nextSection: DashboardSection) {
    if (nextSection === section) return;

    startTransition(() => {
      setSection(nextSection);
      const url = new URL(window.location.href);
      url.searchParams.set("section", nextSection);
      window.history.replaceState(null, "", url.toString());
    });
  }

  const sectionMeta = SECTIONS[section];

  return (
    <div className="flex min-h-screen" style={{ background: "var(--db-bg)" }}>
      <EmployerSidebar
        companyName={employer.companyName}
        ownerName={employer.ownerName}
        ownerRole={employer.ownerRole}
        ownerEmail={employer.ownerEmail}
        activeSection={section}
        onSectionChange={handleSectionChange}
      />

      <div className="ml-[220px] flex min-h-screen flex-1 flex-col">
        <header
          className="sticky top-0 z-10 flex h-14 items-center justify-between px-8"
          style={{
            background: "color-mix(in srgb, var(--db-header) 92%, transparent)",
            borderBottom: "1px solid var(--db-border)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[0.62rem] uppercase tracking-[0.2em]"
              style={{ color: "var(--db-text-muted)" }}
            >
              Dashboard
            </span>
            <span
              className="font-mono text-[0.62rem]"
              style={{ color: "var(--db-border)", filter: "brightness(2.5)" }}
            >
              /
            </span>
            <span
              className="font-mono text-[0.62rem] uppercase tracking-[0.2em] font-semibold"
              style={{ color: "var(--db-text-soft)" }}
            >
              {sectionMeta.label}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em]"
              style={{
                background: "color-mix(in srgb, #22c55e 12%, transparent)",
                color: "color-mix(in srgb, #16a34a 100%, var(--db-text) 0%)",
              }}
            >
              <span
                className="size-1.5 rounded-full"
                style={{ background: "#22c55e" }}
              />
              {isPending ? "Switching" : "Live workspace"}
            </div>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 px-8 py-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p
                className="font-mono text-[0.6rem] uppercase tracking-[0.22em] font-semibold"
                style={{ color: "var(--db-text-muted)" }}
              >
                {employer.companyName}
              </p>
              <h1
                className="mt-2 font-display text-4xl"
                style={{ color: "var(--db-text)", letterSpacing: "-0.02em" }}
              >
                {sectionMeta.title}
              </h1>
              <p
                className="mt-2 max-w-2xl text-sm leading-[1.75]"
                style={{ color: "var(--db-text-soft)" }}
              >
                {sectionMeta.description}
              </p>
            </div>

            <div className="grid min-w-[280px] gap-3 sm:grid-cols-3">
              <CompactStat label="Employees" value={String(activeCount)} />
              <CompactStat label="Roles" value={String(uniqueRoles)} />
              <CompactStat label="Avg. progress" value={`${averageProgress}%`} />
            </div>
          </div>

          {section === "overview" ? (
            <DashboardOverview
              companyName={employer.companyName}
              companyWebsite={employer.companyWebsite}
              industry={employer.industry}
              companySize={employer.companySize}
              headquarters={employer.headquarters}
              aboutCompany={employer.aboutCompany}
              employees={employees}
              roles={roles}
            />
          ) : null}

          {section === "employees" ? (
            <EmployeeManagement
              employees={employees}
              availableRoles={roles.map((role) => ({
                roleTitle: role.roleTitle,
                roleId: role.roleId,
              }))}
            />
          ) : null}

          {section === "roles" ? (
            <RoleRequirements
              requirements={roles}
              upsertAction={upsertRoleRequirementAction}
              deleteAction={deleteRoleRequirementAction}
            />
          ) : null}

          {section === "profile" ? <EmployerProfile employer={employer} /> : null}
        </main>
      </div>
    </div>
  );
}

function CompactStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="rounded-[1.15rem] px-4 py-3.5"
      style={{
        background: "var(--db-card)",
        border: "1px solid var(--db-border)",
        boxShadow: "var(--db-shadow-md)",
      }}
    >
      <p
        className="font-mono text-[0.58rem] uppercase tracking-[0.18em]"
        style={{ color: "var(--db-text-muted)" }}
      >
        {label}
      </p>
      <p
        className="mt-2 text-2xl font-semibold tabular-nums"
        style={{ color: "var(--db-text)", letterSpacing: "-0.02em" }}
      >
        {value}
      </p>
    </div>
  );
}
