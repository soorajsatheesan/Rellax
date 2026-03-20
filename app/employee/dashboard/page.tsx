import { withAuth } from "@workos-inc/authkit-nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { signOutEmployeeAction } from "@/components/dashboard/account-actions";
import { BrandLogo } from "@/components/global/brand-logo";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { createAuthenticatedConvexClient } from "@/lib/convex-server";

type CourseColor = "sage" | "slate" | "gold" | "ink";
type CourseStatus = "not_started" | "in_progress" | "completed";

type Course = {
  id: string;
  title: string;
  category: string;
  duration: string;
  lessons: number;
  status: CourseStatus;
  color: CourseColor;
};

const PLACEHOLDER_COURSES: Course[] = [
  {
    id: "c1",
    title: "Workplace Safety & Compliance",
    category: "Compliance",
    duration: "45 min",
    lessons: 6,
    status: "not_started",
    color: "sage",
  },
  {
    id: "c2",
    title: "Code of Conduct & Ethics",
    category: "Onboarding",
    duration: "30 min",
    lessons: 4,
    status: "not_started",
    color: "slate",
  },
  {
    id: "c3",
    title: "Data Privacy & Security",
    category: "Compliance",
    duration: "60 min",
    lessons: 8,
    status: "not_started",
    color: "gold",
  },
  {
    id: "c4",
    title: "Company Culture & Values",
    category: "Onboarding",
    duration: "20 min",
    lessons: 3,
    status: "not_started",
    color: "ink",
  },
];

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
            <div className="flex shrink-0 gap-6">
              <HeroStat label="Modules" value={String(PLACEHOLDER_COURSES.length)} />
              <HeroStat label="Completed" value="0" />
              <HeroStat label="In progress" value="0" />
            </div>
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
            <span
              className="inline-flex rounded-full px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em]"
              style={{
                background: "var(--db-surface)",
                border: "1px solid var(--db-border)",
                color: "var(--db-text-muted)",
              }}
            >
              {PLACEHOLDER_COURSES.length} modules
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {PLACEHOLDER_COURSES.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
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

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-3xl text-white">{value}</p>
      <p className="mt-1 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-white/40">
        {label}
      </p>
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

const COURSE_COLOR_MAP: Record<
  CourseColor,
  { headerBg: string; pillBorder: string; pillBg: string; pillText: string; dot: string }
> = {
  sage: {
    headerBg: "var(--rellax-sage)",
    pillBorder: "rgba(255,255,255,0.22)",
    pillBg: "rgba(255,255,255,0.14)",
    pillText: "#fff",
    dot: "rgba(255,255,255,0.7)",
  },
  slate: {
    headerBg: "var(--rellax-slate)",
    pillBorder: "rgba(255,255,255,0.22)",
    pillBg: "rgba(255,255,255,0.14)",
    pillText: "#fff",
    dot: "rgba(255,255,255,0.7)",
  },
  gold: {
    headerBg: "#7a5c28",
    pillBorder: "rgba(255,255,255,0.22)",
    pillBg: "rgba(255,255,255,0.14)",
    pillText: "#fff",
    dot: "rgba(255,255,255,0.7)",
  },
  ink: {
    headerBg: "#1e1e28",
    pillBorder: "rgba(255,255,255,0.18)",
    pillBg: "rgba(255,255,255,0.10)",
    pillText: "rgba(255,255,255,0.80)",
    dot: "rgba(255,255,255,0.5)",
  },
};

const STATUS_LABEL: Record<CourseStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
};

function CourseCard({ course }: { course: Course }) {
  const c = COURSE_COLOR_MAP[course.color];

  return (
    <div
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[1.5rem] transition"
      style={{
        background: "var(--db-card)",
        border: "1px solid var(--db-border)",
        boxShadow: "var(--db-shadow-sm)",
      }}
    >
      {/* Colored header band */}
      <div
        className="h-20 px-5 pt-4"
        style={{ background: c.headerBg }}
      >
        <div className="flex items-start justify-between gap-2">
          <span
            className="inline-flex rounded-full px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.14em]"
            style={{
              border: `1px solid ${c.pillBorder}`,
              background: c.pillBg,
              color: c.pillText,
            }}
          >
            {course.category}
          </span>
          <span
            className="mt-1 size-2 shrink-0 rounded-full"
            style={{ background: c.dot }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 pt-4">
        <h3
          className="text-sm font-semibold leading-6"
          style={{ color: "var(--db-text)" }}
        >
          {course.title}
        </h3>

        <div className="mt-3 flex items-center gap-2.5">
          <span
            className="font-mono text-[0.58rem] uppercase tracking-[0.12em]"
            style={{ color: "var(--db-text-muted)" }}
          >
            {course.duration}
          </span>
          <span
            className="size-1 rounded-full"
            style={{ background: "var(--db-border)" }}
          />
          <span
            className="font-mono text-[0.58rem] uppercase tracking-[0.12em]"
            style={{ color: "var(--db-text-muted)" }}
          >
            {course.lessons} lessons
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div
            className="h-1 overflow-hidden rounded-full"
            style={{ background: "var(--db-surface)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: course.status === "completed" ? "100%" : "0%",
                background: "var(--rellax-sage)",
              }}
            />
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span
            className="font-mono text-[0.58rem] uppercase tracking-[0.12em]"
            style={{ color: "var(--db-text-muted)" }}
          >
            {STATUS_LABEL[course.status]}
          </span>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.62rem] font-semibold text-white transition hover:opacity-80"
            style={{ background: "var(--rellax-sage)" }}
          >
            Start
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path
                d="M2 5h6M5.5 2.5 8 5l-2.5 2.5"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
