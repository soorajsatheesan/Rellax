"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { Id } from "@/convex/_generated/dataModel";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RoleRequirementRecord = {
  _id: Id<"role_requirements">;
  roleTitle: string;
  roleId?: string;
  requiredSkills: string[];
  jdText?: string;
  jdFileUrl?: string;
  updatedAt: number;
};

type ActionState = { error?: string; success?: string };

type Props = {
  requirements: RoleRequirementRecord[];
  upsertAction: (
    prevState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  deleteAction: (
    prevState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
};

const initialState: ActionState = {};

// ─── Component ────────────────────────────────────────────────────────────────

export function RoleRequirements({
  requirements,
  upsertAction,
  deleteAction,
}: Props) {
  const [upsertState, upsertFormAction, upsertPending] = useActionState(
    upsertAction,
    initialState,
  );
  const [deleteState, deleteFormAction] = useActionState(
    deleteAction,
    initialState,
  );
  const router = useRouter();
  const [editing, setEditing] = useState<RoleRequirementRecord | null>(null);
  const [roleTitle, setRoleTitle] = useState("");
  const [roleId, setRoleId] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [jdText, setJdText] = useState("");
  const [jdFileName, setJdFileName] = useState("");

  useEffect(() => {
    if (upsertState.success || deleteState.success) {
      router.refresh();
    }
  }, [upsertState.success, deleteState.success, router]);

  function startEdit(req: RoleRequirementRecord) {
    setEditing(req);
    setRoleTitle(req.roleTitle);
    setRoleId(req.roleId ?? "");
    setSkillsInput(req.requiredSkills.join(", "));
    setJdText(req.jdText ?? "");
    setJdFileName("");
  }

  function resetForm() {
    setEditing(null);
    setRoleTitle("");
    setRoleId("");
    setSkillsInput("");
    setJdText("");
    setJdFileName("");
  }

  const inputStyle = {
    width: "100%",
    borderRadius: "0.75rem",
    padding: "0.625rem 1rem",
    fontSize: "0.875rem",
    outline: "none",
    background: "var(--db-input)",
    border: "1px solid var(--db-input-border)",
    color: "var(--db-text)",
  } as const;

  return (
    <div
      className="rounded-[1.5rem] overflow-hidden"
      style={{
        background: "var(--db-card)",
        border: "1px solid var(--db-border)",
        boxShadow: "var(--db-shadow-sm)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-start justify-between gap-4 px-6 py-5"
        style={{ borderBottom: "1px solid var(--db-border)" }}
      >
        <div>
          <p
            className="font-mono text-[0.62rem] uppercase tracking-[0.2em] font-semibold"
            style={{ color: "var(--db-text-muted)" }}
          >
            Role requirements
          </p>
          <h2
            className="mt-0.5 text-base font-semibold"
            style={{ color: "var(--db-text)" }}
          >
            Required skills by role
          </h2>
        </div>
        <span
          className="inline-flex rounded-full px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em]"
          style={{
            background: "var(--db-surface)",
            border: "1px solid var(--db-border)",
            color: "var(--db-text-muted)",
          }}
        >
          {requirements.length} role{requirements.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Existing requirements */}
      {requirements.length > 0 && (
        <ul style={{ borderBottom: "1px solid var(--db-border)" }}>
          {requirements.map((req, i) => (
            <li
              key={req._id}
              className="flex items-start justify-between gap-4 px-6 py-4"
              style={{
                borderTop: i === 0 ? "none" : "1px solid var(--db-border)",
              }}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p
                    className="text-sm font-semibold capitalize"
                    style={{ color: "var(--db-text)" }}
                  >
                    {req.roleTitle}
                  </p>
                  {req.roleId && (
                    <span
                      className="font-mono text-[0.58rem] uppercase tracking-[0.14em] px-2 py-0.5 rounded-full"
                      style={{
                        background: "var(--db-surface)",
                        border: "1px solid var(--db-border)",
                        color: "var(--db-text-muted)",
                      }}
                    >
                      {req.roleId}
                    </span>
                  )}
                  {(req.jdText || req.jdFileUrl) && (
                    <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                      JD attached
                    </span>
                  )}
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {req.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[0.62rem] font-medium"
                      style={{
                        background: "var(--db-surface)",
                        border: "1px solid var(--db-border)",
                        color: "var(--db-text-soft)",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(req)}
                  className="rounded-full px-3 py-1 text-xs font-medium transition"
                  style={{
                    border: "1px solid var(--db-border)",
                    color: "var(--db-text-soft)",
                    background: "var(--db-card)",
                  }}
                >
                  Edit
                </button>
                <form action={deleteFormAction}>
                  <input type="hidden" name="id" value={req._id} />
                  <button
                    type="submit"
                    className="rounded-full px-3 py-1 text-xs font-medium text-red-500 transition hover:bg-red-500/10"
                    style={{ border: "1px solid rgba(220,38,38,0.25)" }}
                  >
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Empty state */}
      {requirements.length === 0 && (
        <div className="px-6 py-8 text-center">
          <p className="text-sm font-medium" style={{ color: "var(--db-text-soft)" }}>
            No roles defined yet.
          </p>
          <p className="mt-1 text-xs" style={{ color: "var(--db-text-muted)" }}>
            Add a role below so employees can receive a personalised learning path.
          </p>
        </div>
      )}

      {/* Upsert form */}
      <form action={upsertFormAction} className="space-y-3 p-6" onSubmit={resetForm}>
        {editing && (
          <input type="hidden" name="editing" value={editing._id} />
        )}

        <input
          name="roleTitle"
          type="text"
          required
          placeholder="Role title  (e.g. frontend engineer)"
          value={roleTitle}
          onChange={(e) => setRoleTitle(e.target.value)}
          style={inputStyle}
        />

        <input
          name="requiredSkills"
          type="text"
          required
          placeholder="Required skills  (comma-separated: React, TypeScript, …)"
          value={skillsInput}
          onChange={(e) => setSkillsInput(e.target.value)}
          style={inputStyle}
        />

        <input
          name="roleId"
          type="text"
          placeholder="Role ID  (optional, e.g. ENG-001)"
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          style={inputStyle}
        />

        <textarea
          name="jdText"
          placeholder="Paste job description  (optional)"
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          rows={4}
          style={{ ...inputStyle, resize: "vertical" }}
        />

        <div>
          <label
            className="block text-xs mb-1.5"
            style={{ color: "var(--db-text-muted)" }}
          >
            JD file  <span style={{ color: "var(--db-text-soft)" }}>(optional · .pdf, .doc, .docx)</span>
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setJdFileName(file.name);
            }}
            className="block w-full text-xs"
            style={{ color: "var(--db-text-soft)" }}
          />
          {/* Store filename as jdFileUrl placeholder until full storage is wired */}
          <input type="hidden" name="jdFileUrl" value={jdFileName} />
        </div>

        {upsertState.error && (
          <p className="rounded-[0.75rem] border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs text-red-500">
            {upsertState.error}
          </p>
        )}
        {upsertState.success && (
          <p className="rounded-[0.75rem] border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-600">
            {upsertState.success}
          </p>
        )}
        {deleteState.error && (
          <p className="rounded-[0.75rem] border border-red-400/30 bg-red-500/10 px-4 py-3 text-xs text-red-500">
            {deleteState.error}
          </p>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={upsertPending}
            className="flex-1 inline-flex items-center justify-center rounded-full py-2.5 text-sm font-semibold text-white transition hover:opacity-85 disabled:opacity-60"
            style={{ background: "var(--rellax-sage)" }}
          >
            {upsertPending
              ? editing
                ? "Updating…"
                : "Adding…"
              : editing
                ? "Update role"
                : "Add role"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full px-4 py-2.5 text-sm font-medium transition"
              style={{
                border: "1px solid var(--db-border)",
                color: "var(--db-text-soft)",
                background: "var(--db-card)",
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
