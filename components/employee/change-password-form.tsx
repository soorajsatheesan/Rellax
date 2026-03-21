"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { SubmitButton } from "@/components/auth/submit-button";

import {
  changePasswordAction,
  suggestStrongPasswordAction,
  type ChangePasswordState,
} from "@/components/employee/change-password-action";

const initialState: ChangePasswordState = {};

export function ChangePasswordForm() {
  const [state, formAction] = useActionState(changePasswordAction, initialState);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generatePending, startGenerate] = useTransition();

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium" style={{ color: "var(--db-text-soft)" }}>
          Current password
        </label>
        <div className="relative">
          <input
            name="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            className="w-full rounded-2xl px-4 py-3 pr-28 text-sm outline-none"
            style={{
              background: "var(--db-input)",
              border: "1px solid var(--db-input-border)",
              color: "var(--db-text)",
            }}
            placeholder="Enter current password"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-medium transition"
            style={{
              background: "transparent",
              border: "1px solid var(--db-border)",
              color: "var(--db-text-soft)",
            }}
          >
            {showCurrentPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="block text-sm font-medium" style={{ color: "var(--db-text-soft)" }}>
            New password
          </label>
          <button
            type="button"
            disabled={generatePending}
            onClick={() => {
              setGenerateError(null);
              startGenerate(async () => {
                const result = await suggestStrongPasswordAction();
                if (result.error) {
                  setGenerateError(result.error);
                  return;
                }
                if (result.password) {
                  if (newPasswordRef.current) newPasswordRef.current.value = result.password;
                  if (confirmPasswordRef.current) confirmPasswordRef.current.value = result.password;
                }
              });
            }}
            className="rounded-full border px-3 py-1 text-xs font-medium transition disabled:opacity-50"
            style={{
              borderColor: "var(--db-border)",
              color: "var(--db-text-soft)",
            }}
          >
            {generatePending ? "Generating…" : "Generate strong password"}
          </button>
        </div>
        {generateError ? (
          <p className="text-xs text-red-600">{generateError}</p>
        ) : null}
        <div className="relative">
          <input
            ref={newPasswordRef}
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            minLength={14}
            className="w-full rounded-2xl px-4 py-3 pr-28 text-sm outline-none"
            style={{
              background: "var(--db-input)",
              border: "1px solid var(--db-input-border)",
              color: "var(--db-text)",
            }}
            placeholder="Min 14 chars — mixed case, numbers, symbols"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-medium transition"
            style={{
              background: "transparent",
              border: "1px solid var(--db-border)",
              color: "var(--db-text-soft)",
            }}
          >
            {showNewPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium" style={{ color: "var(--db-text-soft)" }}>
          Confirm new password
        </label>
        <div className="relative">
          <input
            ref={confirmPasswordRef}
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            minLength={14}
            className="w-full rounded-2xl px-4 py-3 pr-28 text-sm outline-none"
            style={{
              background: "var(--db-input)",
              border: "1px solid var(--db-input-border)",
              color: "var(--db-text)",
            }}
            placeholder="Re-enter new password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-medium transition"
            style={{
              background: "transparent",
              border: "1px solid var(--db-border)",
              color: "var(--db-text-soft)",
            }}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {state.error ? (
        <p className="rounded-[0.875rem] border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="rounded-[0.875rem] border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600">
          {state.success}
        </p>
      ) : null}

      {state.passwordRequirements ? (
        <div className="space-y-3 rounded-[0.875rem] border border-red-400/30 bg-red-500/10 px-4 py-4">
          <p className="text-sm font-semibold text-red-500">
            Password requirements not met
          </p>
          <p className="text-xs leading-5" style={{ color: "var(--db-text-soft)" }}>
            {state.passwordRequirements.summary}
          </p>
          <div className="space-y-1.5">
            {state.passwordRequirements.checks.map((c) => (
              <div
                key={c.label}
                className="flex items-center gap-2 text-xs"
                style={{ color: c.ok ? "var(--rellax-sage)" : "var(--db-text-soft)" }}
              >
                <span className="font-mono font-bold shrink-0">
                  {c.ok ? "✓" : "✗"}
                </span>
                {c.label}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <SubmitButton idleLabel="Update password" pendingLabel="Updating..." />
    </form>
  );
}

