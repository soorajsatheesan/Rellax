"use client";

import Link from "next/link";
import type { Doc } from "@/convex/_generated/dataModel";

type CourseColor = "sage" | "slate" | "gold" | "ink";
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

const STATUS_LABEL: Record<string, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
};

const CATEGORY_COLORS: CourseColor[] = ["sage", "slate", "gold", "ink"];

function getColorForCategory(category: string): CourseColor {
  const idx = Math.abs(
    category.split("").reduce((a, c) => a + c.charCodeAt(0), 0),
  ) % CATEGORY_COLORS.length;
  return CATEGORY_COLORS[idx];
}

type Module = Doc<"learning_path_modules">;

export function ModuleCard({ module }: { module: Module }) {
  const color = getColorForCategory(module.category);
  const c = COURSE_COLOR_MAP[color];
  const isNotStarted = module.status === "not_started";
  const isInProgress = module.status === "in_progress";
  const isCompleted = module.status === "completed";

  return (
    <div
      className="group flex flex-col overflow-hidden rounded-[1.5rem] transition"
      style={{
        background: "var(--db-card)",
        border: "1px solid var(--db-border)",
        boxShadow: "var(--db-shadow-sm)",
      }}
    >
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
            {module.category}
          </span>
          <span
            className="mt-1 size-2 shrink-0 rounded-full"
            style={{ background: c.dot }}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 pt-4">
        <h3
          className="text-sm font-semibold leading-6"
          style={{ color: "var(--db-text)" }}
        >
          {module.title}
        </h3>

        <div className="mt-3 flex items-center gap-2.5">
          <span
            className="font-mono text-[0.58rem] uppercase tracking-[0.12em]"
            style={{ color: "var(--db-text-muted)" }}
          >
            {module.duration}
          </span>
          <span
            className="size-1 rounded-full"
            style={{ background: "var(--db-border)" }}
          />
          <span
            className="font-mono text-[0.58rem] uppercase tracking-[0.12em]"
            style={{ color: "var(--db-text-muted)" }}
          >
            {module.lessons} lessons
          </span>
        </div>

        <div className="mt-4">
          <div
            className="h-1 overflow-hidden rounded-full"
            style={{ background: "var(--db-surface)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: isCompleted ? "100%" : "0%",
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
            {STATUS_LABEL[module.status]}
          </span>
          {isNotStarted ? (
            <Link
              href={`/employee/roadmap/${module._id}`}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.62rem] font-semibold text-white transition hover:opacity-80"
              style={{ background: "var(--rellax-sage)", textDecoration: "none" }}
            >
              Start
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 5h6M5.5 2.5 8 5l-2.5 2.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ) : isInProgress ? (
            <Link
              href={`/employee/roadmap/${module._id}`}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.62rem] font-semibold text-white transition hover:opacity-80"
              style={{ background: "var(--rellax-sage)", textDecoration: "none" }}
            >
              Continue
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 5h6M5.5 2.5 8 5l-2.5 2.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          ) : (
            <span
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[0.62rem] font-semibold"
              style={{ color: "var(--rellax-sage)", background: "rgba(34, 197, 94, 0.1)" }}
            >
              ✓ Completed
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
