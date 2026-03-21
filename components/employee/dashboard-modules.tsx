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

export function DashboardModules({ companyName, serverLearningPath }: Props) {
  const clientData = useQuery(api.employeeLearning.getLearningPathForEmployee, {});
  const lastGoodData = useRef<LearningPathData | undefined>(
    serverLearningPath ?? undefined,
  );

  useEffect(() => {
    if (clientData?.modules?.length) lastGoodData.current = clientData;
    else if (serverLearningPath?.modules?.length) lastGoodData.current = serverLearningPath;
  }, [clientData, serverLearningPath]);

  const data =
    clientData === undefined
      ? lastGoodData.current ?? serverLearningPath ?? undefined
      : clientData ?? lastGoodData.current ?? (serverLearningPath ?? null);

  if (data === undefined) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-[1.5rem]"
            style={{
              background: "var(--db-surface)",
              border: "1px solid var(--db-border)",
            }}
          />
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div
        className="rounded-[1.5rem] p-8"
        style={{
          background: "var(--db-card)",
          border: "1px solid var(--db-border)",
          boxShadow: "var(--db-shadow-sm)",
        }}
      >
        <p className="text-sm leading-7" style={{ color: "var(--db-text-soft)" }}>
          No learning path yet. Upload your resume to get a personalized learning
          roadmap.
        </p>
        <Link
          href="/employee/upload-resume"
          className="mt-4 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className="inline-flex rounded-full px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em]"
          style={{
            background: "var(--db-surface)",
            border: "1px solid var(--db-border)",
            color: "var(--db-text-muted)",
          }}
        >
          {modules.length} modules
        </span>
        <Link
          href="/employee/roadmap"
          className="text-xs font-medium transition hover:underline"
          style={{ color: "var(--rellax-sage)" }}
        >
          View roadmap →
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => (
          <ModuleCard key={module._id} module={module} />
        ))}
      </div>
    </div>
  );
}

export function useLearningPathStats(): {
  total: number;
  completed: number;
  inProgress: number;
  hasPath: boolean;
  loading: boolean;
} {
  const data = useQuery(api.employeeLearning.getLearningPathForEmployee, {});

  if (data === undefined) {
    return { total: 0, completed: 0, inProgress: 0, hasPath: false, loading: true };
  }
  if (!data) {
    return { total: 0, completed: 0, inProgress: 0, hasPath: false, loading: false };
  }

  const { modules } = data;
  return {
    total: modules.length,
    completed: modules.filter((m) => m.status === "completed").length,
    inProgress: modules.filter((m) => m.status === "in_progress").length,
    hasPath: true,
    loading: false,
  };
}
