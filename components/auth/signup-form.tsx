"use client";

import Link from "next/link";

import { SocialAuthLinks } from "@/components/auth/social-auth-links";

export function SignupForm({ initialError }: { initialError?: string }) {
  const errorMessage = initialError;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-3xl text-[var(--rellax-ink)]">
          Employer access
        </h2>
        <p className="mt-3 text-sm leading-7 text-[var(--rellax-ink-soft)]">
          Continue with Google or Outlook. If the company profile already
          exists, Rellax takes you straight to the employer dashboard. If not,
          onboarding asks for the company name, your name, and your role.
        </p>
      </div>

      {errorMessage ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      <SocialAuthLinks mode="sign-up" />

      <p className="text-sm text-[var(--rellax-ink-soft)]">
        Already have access?{" "}
        <Link
          href="/login"
          className="text-[var(--rellax-sage)] underline-offset-4 hover:underline"
        >
          Sign in as employer or employee
        </Link>
      </p>
    </div>
  );
}
