"use client";

import { useActionState, useState } from "react";
import { SubmitButton } from "@/components/auth/submit-button";

import {
  changePasswordAction,
  type ChangePasswordState,
} from "@/components/employee/change-password-action";

const initialState: ChangePasswordState = {};

export function ChangePasswordForm() {
  const [state, formAction] = useActionState(changePasswordAction, initialState);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium" style={{ color: "var(--db-text)" }}>
          Current password
        </label>
        <div className="relative">
          <input
            name="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            className="w-full rounded-2xl border border-black/8 bg-[var(--db-surface)] px-4 py-3 pr-28 text-sm outline-none transition focus:border-[var(--db-border)]"
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
        <label className="block text-sm font-medium" style={{ color: "var(--db-text)" }}>
          New password
        </label>
        <div className="relative">
          <input
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            className="w-full rounded-2xl border border-black/8 bg-[var(--db-surface)] px-4 py-3 pr-28 text-sm outline-none transition focus:border-[var(--db-border)]"
            placeholder="Enter new password"
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
        <label className="block text-sm font-medium" style={{ color: "var(--db-text)" }}>
          Confirm new password
        </label>
        <div className="relative">
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            className="w-full rounded-2xl border border-black/8 bg-[var(--db-surface)] px-4 py-3 pr-28 text-sm outline-none transition focus:border-[var(--db-border)]"
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
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {state.success}
        </p>
      ) : null}

      {state.passwordRequirements ? (
        <div className="space-y-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-semibold text-red-800">
            Password requirements check
          </p>
          <p className="text-xs text-red-700 italic">
            {state.passwordRequirements.summary}
          </p>
          <div className="space-y-1">
            {state.passwordRequirements.checks.map((c) => (
              <div key={c.label} className="text-xs text-red-800 italic">
                <span style={{ marginRight: "0.5rem" }}>
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

