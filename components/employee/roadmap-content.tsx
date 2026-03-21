"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { deleteLearningGenerationAction } from "./delete-learning-generation-action";
import { ModuleCard } from "./module-card";
import { getLearningPathState, hasAssignedModules } from "./learning-path-state";

type LearningPathData = {
  path: Doc<"learning_paths">;
  modules: Doc<"learning_path_modules">[];
} | null;

type Props = {
  companyName: string;
  serverLearningPath?: LearningPathData | null;
};

export function RoadmapContent({ companyName, serverLearningPath }: Props) {
  const clientData = useQuery(api.employeeLearning.getLearningPathForEmployee, {});
  const isRequestInFlight = useRef(false);

  // Prefer client when ready; fall back to server when client loading/null; use last-good to avoid flicker
  const data =
    clientData === undefined
      ? serverLearningPath ?? undefined
      : clientData ?? (serverLearningPath ?? null);

  const learningPathState = getLearningPathState(data);
  const pathId = data && "path" in data ? data.path._id : undefined;
  const shouldGenerate =
    learningPathState === "ready" &&
    data !== null &&
    data !== undefined &&
    (data.path.generationStatus === "roadmap_ready" || data.path.generationStatus === "generating");

  useEffect(() => {
    if (!shouldGenerate || !pathId) {
      return;
    }

    const triggerGeneration = async () => {
      if (isRequestInFlight.current) {
        return;
      }

      isRequestInFlight.current = true;
      try {
        await fetch("/api/learning/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pathId }),
        });
      } finally {
        isRequestInFlight.current = false;
      }
    };

    const initialTimer = window.setTimeout(() => {
      void triggerGeneration();
    }, 300);
    const interval = window.setInterval(() => {
      void triggerGeneration();
    }, 2500);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
    };
  }, [pathId, shouldGenerate]);

  if (learningPathState === "loading") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-56 animate-pulse rounded-[1.5rem]"
            style={{
              background: "var(--db-surface)",
              border: "1px solid var(--db-border)",
            }}
          />
        ))}
      </div>
    );
  }

  if (learningPathState !== "ready") {
    const description =
      learningPathState === "empty"
        ? "Your learning path exists, but no modules have been assigned yet. Upload an updated resume to regenerate your roadmap."
        : "No learning path yet. Upload your resume to generate a personalized path.";

    return (
      <div className="space-y-6 py-8">
        <p className="text-sm leading-7" style={{ color: "var(--db-text-soft)" }}>
          {description}
        </p>
        <Link
          href="/employee/upload-resume"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ background: "var(--rellax-sage)" }}
        >
          Upload resume
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 7h8M7.5 3.5 10 7l-2.5 2.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    );
  }

  if (!hasAssignedModules(data)) {
    return null;
  }

  const { modules } = data;
  const completed = modules.filter((m) => m.status === "completed").length;
  const inProgress = modules.filter((m) => m.status === "in_progress").length;
  const readyContentModules = modules.filter((m) => m.generationStatus === "ready").length;
  const generatingModule = modules.find((m) => m.generationStatus === "processing");
  const queuedCount = modules.filter((m) => m.generationStatus === "pending").length;
  const failedCount = modules.filter((m) => m.generationStatus === "failed").length;

  return (
    <div className="space-y-6">
      {shouldGenerate ? (
        <div
          className="rounded-[1.25rem] px-5 py-4"
          style={{
            background: "var(--db-card)",
            border: "1px solid var(--db-border)",
            boxShadow: "var(--db-shadow-sm)",
          }}
        >
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em]" style={{ color: "var(--db-text-muted)" }}>
            Content engine
          </p>
          <p className="mt-2 text-sm leading-7" style={{ color: "var(--db-text-soft)" }}>
            {readyContentModules > 0
              ? `${readyContentModules} module${readyContentModules === 1 ? "" : "s"} ready. ${generatingModule ? `${generatingModule.title} is generating now.` : "Next module is queued."}`
              : "Your roadmap is ready. The first module is generating now so you can start learning without waiting for the full path."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className="inline-flex rounded-full px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.14em]"
              style={{
                background: "color-mix(in srgb, var(--rellax-sage) 10%, transparent)",
                border: "1px solid color-mix(in srgb, var(--rellax-sage) 25%, transparent)",
                color: "var(--rellax-sage)",
              }}
            >
              {readyContentModules} ready
            </span>
            <span
              className="inline-flex rounded-full px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.14em]"
              style={{
                background: "var(--db-surface)",
                border: "1px solid var(--db-border)",
                color: "var(--db-text-muted)",
              }}
            >
              {queuedCount} queued
            </span>
            {failedCount > 0 ? (
              <span
                className="inline-flex rounded-full px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.14em]"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "rgb(220,38,38)",
                }}
              >
                {failedCount} failed
              </span>
            ) : null}
          </div>
          <form action={deleteLearningGenerationAction} className="mt-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
              style={{
                background: "var(--db-surface)",
                border: "1px solid var(--db-border)",
                color: "var(--db-text)",
              }}
            >
              Delete generation
            </button>
          </form>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p
          className="font-mono text-[0.6rem] uppercase tracking-[0.22em]"
          style={{ color: "var(--db-text-muted)" }}
        >
          {companyName} · Your learning path
        </p>
        <div className="flex flex-wrap gap-2">
          <span
            className="inline-flex rounded-full px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em]"
            style={{
              background: "var(--db-surface)",
              border: "1px solid var(--db-border)",
              color: "var(--db-text-muted)",
            }}
          >
            {modules.length} modules
          </span>
          <span
            className="inline-flex rounded-full px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em]"
            style={{
              background: "color-mix(in srgb, var(--rellax-sage) 10%, transparent)",
              border: "1px solid color-mix(in srgb, var(--rellax-sage) 25%, transparent)",
              color: "var(--rellax-sage)",
            }}
          >
            {readyContentModules} ready now
          </span>
          <span
            className="inline-flex rounded-full px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em]"
            style={{
              background: "color-mix(in srgb, var(--rellax-sage) 10%, transparent)",
              border: "1px solid color-mix(in srgb, var(--rellax-sage) 25%, transparent)",
              color: "var(--rellax-sage)",
            }}
          >
            {completed} completed
          </span>
          {inProgress > 0 && (
            <span
              className="inline-flex rounded-full px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em]"
              style={{
                background: "var(--db-surface)",
                border: "1px solid var(--db-border)",
                color: "var(--db-text-soft)",
              }}
            >
              {inProgress} in progress
            </span>
          )}
          <span
            className="inline-flex rounded-full px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em]"
            style={{
              background: "color-mix(in srgb, var(--rellax-sage) 10%, transparent)",
              border: "1px solid color-mix(in srgb, var(--rellax-sage) 25%, transparent)",
              color: "var(--rellax-sage)",
            }}
          >
            video-ready
          </span>
          {!shouldGenerate ? (
            <form action={deleteLearningGenerationAction}>
              <button
                type="submit"
                className="inline-flex rounded-full px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em]"
                style={{
                  background: "var(--db-surface)",
                  border: "1px solid var(--db-border)",
                  color: "var(--db-text-muted)",
                }}
              >
                Delete generation
              </button>
            </form>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => (
          <ModuleCard key={module._id} module={module} />
        ))}
      </div>
    </div>
  );
}
