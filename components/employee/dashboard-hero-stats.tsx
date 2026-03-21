"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

type LearningPathData = {
  path: Doc<"learning_paths">;
  modules: Doc<"learning_path_modules">[];
} | null;

type Props = {
  serverLearningPath?: LearningPathData | null;
};

export function DashboardHeroStats({ serverLearningPath }: Props) {
  const clientData = useQuery(api.employeeLearning.getLearningPathForEmployee, {});
  const data =
    clientData === undefined
      ? serverLearningPath ?? undefined
      : clientData ?? (serverLearningPath ?? null);

  const total = data?.modules?.length ?? 0;
  const completed = data?.modules?.filter((m) => m.status === "completed").length ?? 0;
  const inProgress =
    data?.modules?.filter((m) => m.status === "in_progress").length ?? 0;

  return (
    <div
      className="flex shrink-0 gap-1 rounded-[1.25rem] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm"
    >
      <HeroStat label="Modules" value={String(total)} />
      <div className="mx-4 w-px self-stretch" style={{ background: "rgba(255,255,255,0.10)" }} />
      <HeroStat label="Completed" value={String(completed)} />
      <div className="mx-4 w-px self-stretch" style={{ background: "rgba(255,255,255,0.10)" }} />
      <HeroStat label="In progress" value={String(inProgress)} />
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center px-2">
      <p
        className="font-display text-3xl text-white tabular-nums"
        style={{ letterSpacing: "-0.02em" }}
      >
        {value}
      </p>
      <p className="mt-1.5 font-mono text-[0.56rem] uppercase tracking-[0.2em] text-white/55">
        {label}
      </p>
    </div>
  );
}
