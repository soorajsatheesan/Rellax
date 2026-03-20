import Link from "next/link";

import { BrandLogo } from "@/components/global/brand-logo";
import { Container } from "@/components/global/container";
import { FOOTER_COLUMNS } from "@/components/home/data";

export function SiteFooter() {
  return (
    <footer className="bg-[var(--rellax-ink-2)] py-16 text-white">
      <Container>
        <div className="grid gap-10 border-b border-white/8 pb-10 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <BrandLogo tone="light" />
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/45">
              Adaptive onboarding infrastructure for modern teams that need role
              readiness, not generic content.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <div className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-white/30">
                {column.title}
              </div>
              <ul className="mt-5 space-y-3 text-sm text-white/55">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 pt-6 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 RELLAX. All rights reserved.</span>
          <span>Built for collaborative onboarding at scale.</span>
        </div>
      </Container>
    </footer>
  );
}
