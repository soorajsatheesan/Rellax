import type { ReactNode } from "react";

import { BrandLogo } from "@/components/global/brand-logo";
import { Container } from "@/components/global/container";

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[var(--rellax-surface)] py-10">
      <Container className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-[0_24px_70px_rgba(8,8,9,0.06)] lg:grid-cols-[1.1fr_0.9fr]">
          <section className="bg-[var(--rellax-ink)] p-8 text-white sm:p-12">
            <BrandLogo tone="light" />
            <div className="mt-10">
              <div className="inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.22em] text-white/70">
                {eyebrow}
              </div>
              <h1 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">
                {title}
              </h1>
              <p className="mt-5 max-w-md text-base leading-8 text-white/68">
                {description}
              </p>
            </div>
          </section>

          <section className="p-8 sm:p-12">{children}</section>
        </div>
      </Container>
    </main>
  );
}
