"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { SubmitButton } from "@/components/auth/submit-button";

import { submitResumeAction, type SubmitResumeState } from "./submit-resume-action";

const initialState: SubmitResumeState = {};
const STAGES = [
  "Reading resume input",
  "Extracting skills with Rellax AI",
  "Matching role gaps",
  "Generating adaptive roadmap with Rellax AI",
  "Saving roadmap",
  "Starting module-by-module content engine",
] as const;

function UploadProgress() {
  const { pending } = useFormStatus();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!pending) {
      return;
    }
    const timer = window.setInterval(() => {
      setTick((currentTick) => currentTick + 1);
    }, 2200);

    return () => {
      window.clearInterval(timer);
    };
  }, [pending]);

  if (!pending) {
    return null;
  }

  const stageIndex = Math.min(tick, STAGES.length - 1);

  return (
    <div
      className="space-y-3 rounded-[1rem] border px-4 py-4"
      style={{
        background: "var(--db-surface)",
        borderColor: "var(--db-border)",
      }}
    >
      <p className="text-sm font-semibold" style={{ color: "var(--db-text)" }}>
        Building your personalized course
      </p>
      <div className="space-y-2">
        {STAGES.map((stage, index) => {
          const isComplete = index < stageIndex;
          const isActive = index === stageIndex;

          return (
            <div key={stage} className="flex items-center gap-3 text-sm">
              <span
                className="flex size-6 items-center justify-center rounded-full font-mono text-[0.65rem]"
                style={{
                  background: isComplete || isActive
                    ? "color-mix(in srgb, var(--rellax-sage) 16%, transparent)"
                    : "var(--db-card)",
                  border: `1px solid ${
                    isComplete || isActive
                      ? "color-mix(in srgb, var(--rellax-sage) 25%, transparent)"
                      : "var(--db-border)"
                  }`,
                  color: isComplete || isActive ? "var(--rellax-sage)" : "var(--db-text-muted)",
                }}
              >
                {isComplete ? "✓" : index + 1}
              </span>
              <span
                style={{
                  color: isActive
                    ? "var(--db-text)"
                    : isComplete
                    ? "var(--db-text-soft)"
                    : "var(--db-text-muted)",
                }}
              >
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function UploadResumeForm() {
  const [state, formAction] = useActionState(submitResumeAction, initialState);
  const [progressSeed, setProgressSeed] = useState(0);

  return (
    <form
      action={formAction}
      className="space-y-4"
      encType="multipart/form-data"
      onSubmit={() => setProgressSeed((currentSeed) => currentSeed + 1)}
    >
      <div>
        <label
          className="block text-sm font-semibold"
          style={{ color: "var(--db-text-soft)" }}
        >
          Upload your resume
        </label>
        <p className="mt-1 text-xs leading-5" style={{ color: "var(--db-text-muted)" }}>
          Word (.docx) or PDF. We extract your skills, compare them with the job requirements, create an adaptive roadmap, then generate notes, narrated slide content, and Q&A for each module in the background.
        </p>
        <input
          type="file"
          name="resumeFile"
          accept=".docx,.pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
          className="mt-2 block w-full rounded-2xl border px-4 py-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-[var(--rellax-sage)] file:px-4 file:py-2 file:text-sm file:text-white"
          style={{
            background: "var(--db-surface)",
            borderColor: "var(--db-border)",
            color: "var(--db-text)",
          }}
        />
      </div>

      <div>
        <label
          className="block text-sm font-semibold"
          style={{ color: "var(--db-text-soft)" }}
        >
          Or paste text
        </label>
        <p className="mt-1 text-xs leading-5" style={{ color: "var(--db-text-muted)" }}>
          Prefer to type? Paste at least 50 characters of your resume below instead.
        </p>
        <textarea
          name="resumeText"
          rows={6}
          placeholder="Paste resume text here (optional if you uploaded a file)..."
          className="mt-2 w-full resize-y rounded-2xl border px-4 py-3 text-sm outline-none transition focus:border-[var(--rellax-sage)]"
          style={{
            background: "var(--db-surface)",
            borderColor: "var(--db-border)",
            color: "var(--db-text)",
          }}
        />
      </div>

      {state.error ? (
        <p className="rounded-[0.875rem] border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {state.error}
        </p>
      ) : null}

      <UploadProgress key={progressSeed} />

      <SubmitButton
        idleLabel="Generate adaptive path"
        pendingLabel="Creating roadmap..."
      />
    </form>
  );
}
