export type LearningPathState = "loading" | "missing" | "empty" | "ready";

type LearningPathLike<TModule> =
  | {
      modules: TModule[];
    }
  | null
  | undefined;

export function getLearningPathState<TModule>(
  data: LearningPathLike<TModule>,
): LearningPathState {
  if (data === undefined) return "loading";
  if (data === null) return "missing";
  if (data.modules.length === 0) return "empty";
  return "ready";
}

export function hasAssignedModules<TModule>(
  data: LearningPathLike<TModule>,
): data is { modules: [TModule, ...TModule[]] } {
  return getLearningPathState(data) === "ready";
}
