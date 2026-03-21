"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { ModuleCard } from "./module-card";

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
  const lastGoodData = useRef<LearningPathData | undefined>(
    serverLearningPath ?? undefined,
  );

  useEffect(() => {
    if (clientData?.modules?.length) lastGoodData.current = clientData;
    else if (serverLearningPath?.modules?.length) lastGoodData.current = serverLearningPath;
  }, [clientData, serverLearningPath]);

  // Prefer client when ready; fall back to server when client loading/null; use last-good to avoid flicker
  const data =
    clientData === undefined
      ? lastGoodData.current ?? serverLearningPath ?? undefined
      : clientData ?? lastGoodData.current ?? (serverLearningPath ?? null);

  if (data === undefined) {
    return (
      <div className="py-12 text-center" style={{ color: "var(--db-text-muted)" }}>
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6 py-8">
        <p className="text-sm leading-7" style={{ color: "var(--db-text-soft)" }}>
          No learning path yet. Upload your resume to generate a personalized path.
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

  const { modules } = data;
  const completed = modules.filter((m) => m.status === "completed").length;
  const inProgress = modules.filter((m) => m.status === "in_progress").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p
          className="font-mono text-[0.62rem] uppercase tracking-[0.2em]"
          style={{ color: "var(--db-text-muted)" }}
        >
          {companyName} · Your learning path
        </p>
        <div className="flex gap-6">
          <span className="font-mono text-[0.62rem] uppercase" style={{ color: "var(--db-text-muted)" }}>
            {modules.length} modules
          </span>
          <span className="font-mono text-[0.62rem] uppercase" style={{ color: "var(--db-text-muted)" }}>
            {completed} completed · {inProgress} in progress
          </span>
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
