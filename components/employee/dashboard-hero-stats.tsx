"use client";

import { useRef, useEffect } from "react";
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

  const total = data?.modules?.length ?? 0;
  const completed = data?.modules?.filter((m) => m.status === "completed").length ?? 0;
  const inProgress =
    data?.modules?.filter((m) => m.status === "in_progress").length ?? 0;

  return (
    <div className="flex shrink-0 gap-6">
      <HeroStat label="Modules" value={String(total)} />
      <HeroStat label="Completed" value={String(completed)} />
      <HeroStat label="In progress" value={String(inProgress)} />
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
