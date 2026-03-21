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

const GENERATION_LABEL: Record<string, string> = {
  pending: "Queued",
  processing: "Generating",
  partial: "Partial",
  ready: "Ready",
  failed: "Failed",
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
  const isGenerationReady = module.generationStatus === "ready";
  const canOpen = isGenerationReady;

  return (
    <div
      className="group flex flex-col overflow-hidden rounded-[1.5rem] transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "var(--db-card)",
        border: "1px solid var(--db-border)",
        boxShadow: "var(--db-shadow-md)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--db-shadow-lg)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--db-shadow-md)";
      }}
    >
      <div
        className="h-24 px-5 pt-5"
        style={{ background: c.headerBg }}
      >
        <div className="flex items-start justify-between gap-2">
          <span
            className="font-mono text-[0.54rem] uppercase tracking-[0.18em]"
            style={{
              color: c.pillText,
              opacity: 0.78,
            }}
          >
            Module
          </span>
          <span
            className="mt-0.5 size-2 shrink-0 rounded-full"
            style={{ background: c.dot }}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3
          className="text-sm font-semibold leading-[1.5]"
          style={{
            color: "var(--db-text)",
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "6rem",
          }}
        >
          {module.title}
        </h3>
        {module.summary ? (
          <p
            className="mt-2 text-sm leading-6"
            style={{
              color: "var(--db-text-soft)",
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "6rem",
            }}
          >
            {module.summary}
          </p>
        ) : null}

        <div className="mt-3 flex items-center gap-2">
          <span
            className="font-mono text-[0.56rem] uppercase tracking-[0.14em]"
            style={{ color: "var(--db-text-muted)" }}
          >
            {module.duration}
          </span>
          <span
            className="size-1 shrink-0 rounded-full"
            style={{ background: "var(--db-text-muted)", opacity: 0.35 }}
          />
          <span
            className="font-mono text-[0.56rem] uppercase tracking-[0.14em]"
            style={{ color: "var(--db-text-muted)" }}
          >
            {module.lessons} {module.lessons === 1 ? "lesson" : "lessons"}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {module.generationStatus ? (
            <span
              className="inline-flex rounded-full px-2.5 py-1 font-mono text-[0.52rem] uppercase tracking-[0.14em]"
              style={{
                background:
                  module.generationStatus === "failed"
                    ? "rgba(239,68,68,0.08)"
                    : module.generationStatus === "ready"
                    ? "color-mix(in srgb, var(--rellax-sage) 10%, transparent)"
                    : "var(--db-surface)",
                border:
                  module.generationStatus === "failed"
                    ? "1px solid rgba(239,68,68,0.2)"
                    : module.generationStatus === "ready"
                    ? "1px solid color-mix(in srgb, var(--rellax-sage) 25%, transparent)"
                    : "1px solid var(--db-border)",
                color:
                  module.generationStatus === "failed"
                    ? "rgb(220,38,38)"
                    : module.generationStatus === "ready"
                    ? "var(--rellax-sage)"
                    : "var(--db-text-muted)",
              }}
            >
              {GENERATION_LABEL[module.generationStatus] ?? "Queued"}
            </span>
          ) : null}
        </div>

        <div className="mt-4">
          <div
            className="h-1.5 overflow-hidden rounded-full"
            style={{ background: "var(--db-surface)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: isCompleted ? "100%" : isInProgress ? "45%" : "0%",
                background: isCompleted
                  ? "var(--rellax-sage)"
                  : "color-mix(in srgb, var(--rellax-sage) 70%, var(--rellax-slate))",
              }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <span
            className="font-mono text-[0.56rem] uppercase tracking-[0.14em] font-medium"
            style={{
              color: isCompleted
                ? "var(--rellax-sage)"
                : isInProgress
                ? "var(--db-text-soft)"
                : "var(--db-text-muted)",
            }}
          >
            {STATUS_LABEL[module.status]}
          </span>
          {!canOpen ? (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.62rem] font-semibold"
              style={{
                color: module.generationStatus === "failed" ? "rgb(220,38,38)" : "var(--db-text-muted)",
                background: "var(--db-surface)",
                border: "1px solid var(--db-border)",
              }}
            >
              {module.generationStatus === "failed" ? "Retry generation" : "Generating..."}
            </span>
          ) : isNotStarted ? (
            <Link
              href={`/employee/roadmap/${module._id}`}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.62rem] font-semibold text-white transition hover:opacity-85 active:scale-95"
              style={{ background: "var(--rellax-sage)", textDecoration: "none" }}
            >
              Start
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 5h6M5.5 2.5 8 5l-2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ) : isInProgress ? (
            <Link
              href={`/employee/roadmap/${module._id}`}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.62rem] font-semibold text-white transition hover:opacity-85 active:scale-95"
              style={{ background: "var(--rellax-sage)", textDecoration: "none" }}
            >
              Continue
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path d="M2 5h6M5.5 2.5 8 5l-2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ) : (
            <Link
              href={`/employee/roadmap/${module._id}`}
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.62rem] font-semibold transition hover:opacity-85 active:scale-95"
              style={{
                color: "var(--rellax-sage)",
                background: "color-mix(in srgb, var(--rellax-sage) 12%, transparent)",
                border: "1px solid color-mix(in srgb, var(--rellax-sage) 25%, transparent)",
                textDecoration: "none",
              }}
            >
              ✓ Done
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
