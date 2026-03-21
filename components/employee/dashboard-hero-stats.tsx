"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function DashboardHeroStats() {
  const data = useQuery(api.employeeLearning.getLearningPathForEmployee, {});

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
