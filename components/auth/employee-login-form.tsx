"use client";

import { useActionState, useState } from "react";

import {
  signInEmployeeAction,
  type AuthActionState,
} from "@/components/auth/auth-actions";
import { SubmitButton } from "@/components/auth/submit-button";

const initialState: AuthActionState = {};

export function EmployeeLoginForm() {
  const [state, formAction] = useActionState(signInEmployeeAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <h3 className="font-display text-2xl text-[var(--rellax-ink)]">
          Employee sign in
        </h3>
        <p className="mt-2 text-sm leading-7 text-[var(--rellax-ink-soft)]">
          Use the credentials your employer created for you.
        </p>
      </div>

      <input
        name="employeeId"
        type="text"
        required
        placeholder="Employee ID"
        className="w-full rounded-2xl border border-black/8 bg-[var(--rellax-surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--rellax-sage)]"
      />
      <div className="relative">
        <input
          name="password"
          type={showPassword ? "text" : "password"}
          required
          placeholder="Password"
          className="w-full rounded-2xl border border-black/8 bg-[var(--rellax-surface)] px-4 py-3 pr-20 text-sm outline-none transition focus:border-[var(--rellax-sage)]"
        />
        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-medium text-[var(--rellax-ink-soft)] transition hover:bg-white"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      {state.error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <SubmitButton idleLabel="Sign in as employee" pendingLabel="Signing in..." />
    </form>
  );
}
