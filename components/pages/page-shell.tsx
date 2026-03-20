import type { ReactNode } from "react";

import { Container } from "@/components/global/container";
import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";

type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: PageShellProps) {
  return (
    <main className="min-h-screen bg-white text-[var(--rellax-ink)]">
      <SiteHeader />
      <section className="border-b border-black/6 bg-[var(--rellax-surface)] py-20 sm:py-28">
        <Container>
          <span className="inline-flex rounded-full border border-black/6 bg-white px-4 py-1.5 font-mono text-xs uppercase tracking-[0.22em] text-[var(--rellax-ink-muted)]">
            {eyebrow}
          </span>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--rellax-ink-soft)]">
            {description}
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-6">{children}</Container>
      </section>

      <SiteFooter />
    </main>
  );
}
