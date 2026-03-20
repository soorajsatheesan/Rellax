import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";

type VerifyEmailPageProps = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { email } = await searchParams;

  return (
    <AuthCard
      eyebrow="Email verification"
      title="Verify your email address."
      description="Email and password sign-in is enabled after the inbox owner verifies the address."
    >
      <div className="space-y-5">
        <div>
          <h2 className="font-display text-3xl text-[var(--rellax-ink)]">
            Check your inbox
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--rellax-ink-soft)]">
            We sent a verification email
            {email ? (
              <>
                {" "}
                to <span className="font-medium text-[var(--rellax-ink)]">{email}</span>
              </>
            ) : null}
            . Open that message, complete verification, then return to sign in.
          </p>
        </div>

        <div className="rounded-2xl border border-black/6 bg-[var(--rellax-surface)] px-4 py-4 text-sm leading-7 text-[var(--rellax-ink-soft)]">
          Your company details are preserved. After verification, sign in with
          the same email and password and the employer workspace will be
          created automatically.
        </div>

        <Link
          href="/login"
          className="inline-flex rounded-full bg-[var(--rellax-sage)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Continue to sign in
        </Link>
      </div>
    </AuthCard>
  );
}
