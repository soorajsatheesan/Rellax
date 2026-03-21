"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

type Props = {
  module: Doc<"learning_path_modules">;
};

const LESSON_PLACEHOLDERS: Record<number, string[]> = {
  1: ["Key concepts and overview"],
  2: ["Introduction", "Core topics"],
  3: ["Introduction", "Main concepts", "Summary & next steps"],
  4: ["Introduction", "Part 1", "Part 2", "Wrap-up"],
  5: ["Overview", "Lesson 1", "Lesson 2", "Lesson 3", "Recap"],
};

function getLessonTitles(count: number, moduleTitle: string): string[] {
  const templates = LESSON_PLACEHOLDERS[count] ?? Array.from({ length: count }, (_, i) => `Lesson ${i + 1}`);
  return templates.slice(0, count);
}

export function ModuleDetailContent({ module: serverModule }: Props) {
  const clientModule = useQuery(api.employeeLearning.getModuleById, {
    moduleId: serverModule._id,
  });
  const startModule = useMutation(api.employeeLearning.startModule);
  const completeModule = useMutation(api.employeeLearning.completeModule);

  const module = clientModule ?? serverModule;
  const isNotStarted = module.status === "not_started";
  const isInProgress = module.status === "in_progress";
  const isCompleted = module.status === "completed";

  // Auto-start when landing on detail page if not started
  useEffect(() => {
    if (isNotStarted) {
      startModule({ moduleId: serverModule._id });
    }
  }, [isNotStarted, serverModule._id, startModule]);

  const lessonTitles = getLessonTitles(module.lessons, module.title);

  return (
    <div className="space-y-8">
      <div>
        <span
          className="inline-flex rounded-full px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.14em]"
          style={{
            border: "1px solid var(--db-border)",
            background: "var(--db-surface)",
            color: "var(--db-text-muted)",
          }}
        >
          {module.category}
        </span>
        <h1
          className="mt-3 font-display text-2xl sm:text-3xl"
          style={{ color: "var(--db-text)" }}
        >
          {module.title}
        </h1>
        <p
          className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.12em]"
          style={{ color: "var(--db-text-muted)" }}
        >
          {module.duration} · {module.lessons} lessons
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="font-mono text-[0.62rem] uppercase tracking-[0.18em]" style={{ color: "var(--db-text-muted)" }}>
          Lessons
        </h2>
        <div className="space-y-3">
          {lessonTitles.map((title, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-xl px-4 py-4 transition"
              style={{
                background: "var(--db-card)",
                border: "1px solid var(--db-border)",
                boxShadow: "var(--db-shadow-sm)",
              }}
            >
              <span
                className="flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold"
                style={{
                  background: "var(--rellax-sage)",
                  color: "#fff",
                }}
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-sm font-semibold" style={{ color: "var(--db-text)" }}>
                  {title}
                </h3>
                <p className="mt-1 text-sm leading-6" style={{ color: "var(--db-text-soft)" }}>
                  Content for this lesson will be available in a future update. For now, review the key takeaways from this module in your own materials.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <Link
          href="/employee/roadmap"
          className="text-sm font-medium transition"
          style={{ color: "var(--db-text-soft)", textDecoration: "none" }}
        >
          ← Back to roadmap
        </Link>
        {isCompleted ? (
          <span
            className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold"
            style={{ color: "var(--rellax-sage)", background: "rgba(34, 197, 94, 0.1)" }}
          >
            ✓ Completed
          </span>
        ) : (
          <button
            type="button"
            onClick={() => completeModule({ moduleId: serverModule._id })}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: "var(--rellax-sage)" }}
          >
            Complete module
            <svg width="12" height="12" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M1.5 5l2.5 2.5L8.5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
