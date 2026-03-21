"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/auth/submit-button";

import { submitResumeAction, type SubmitResumeState } from "./submit-resume-action";

const initialState: SubmitResumeState = {};

export function UploadResumeForm() {
  const [state, formAction] = useActionState(submitResumeAction, initialState);

  return (
    <form action={formAction} className="space-y-4" encType="multipart/form-data">
      <div>
        <label
          className="block text-sm font-medium"
          style={{ color: "var(--db-text)" }}
        >
          Upload your resume (.docx or .pdf)
        </label>
        <p className="mt-1 text-xs" style={{ color: "var(--db-text-muted)" }}>
          Upload a Word document or PDF. We extract text, identify skills, and build your
          personalized learning path.
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
          className="block text-sm font-medium"
          style={{ color: "var(--db-text)" }}
        >
          Or paste text
        </label>
        <p className="mt-1 text-xs" style={{ color: "var(--db-text-muted)" }}>
          Prefer to paste? Paste at least 50 characters of your resume below.
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
        <p
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </p>
      ) : null}

      <SubmitButton
        idleLabel="Generate learning path"
        pendingLabel="Extracting skills..."
      />
    </form>
  );
}
