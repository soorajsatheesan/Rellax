"use client";

import Link from "next/link";
import { useState } from "react";

import { EmployeeLoginForm } from "@/components/auth/employee-login-form";
import { SocialAuthLinks } from "@/components/auth/social-auth-links";

export function LoginForm({
  defaultView = "employer",
}: {
  defaultView?: "employer" | "employee";
}) {
  const [view, setView] = useState<"employer" | "employee">(defaultView);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-3xl text-[var(--rellax-ink)]">
          Welcome back
        </h2>
        <p className="mt-3 text-sm leading-7 text-[var(--rellax-ink-soft)]">
          Choose employer or employee access. Employer accounts use Google or
          Outlook. Employee accounts use credentials issued by the employer.
        </p>
      </div>

      <div className="inline-flex rounded-full border border-black/8 bg-[var(--rellax-surface)] p-1">
        <button
          type="button"
          onClick={() => setView("employer")}
          className={`rounded-full px-4 py-2 text-sm transition ${
            view === "employer"
              ? "bg-white text-[var(--rellax-ink)] shadow-sm"
              : "text-[var(--rellax-ink-soft)]"
          }`}
        >
          Employer
        </button>
        <button
          type="button"
          onClick={() => setView("employee")}
          className={`rounded-full px-4 py-2 text-sm transition ${
            view === "employee"
              ? "bg-white text-[var(--rellax-ink)] shadow-sm"
              : "text-[var(--rellax-ink-soft)]"
          }`}
        >
          Employee
        </button>
      </div>

      {view === "employer" ? <SocialAuthLinks mode="sign-in" /> : <EmployeeLoginForm />}

      <p className="text-sm text-[var(--rellax-ink-soft)]">
        Need employer access?{" "}
        <Link
          href="/signup"
          className="text-[var(--rellax-sage)] underline-offset-4 hover:underline"
        >
          Sign up or sign in as employer
        </Link>
      </p>
    </div>
  );
}
