import type { Metadata } from "next";

import { ContentBlock } from "@/components/pages/content-block";
import { PageShell } from "@/components/pages/page-shell";

export const metadata: Metadata = {
  title: "Careers | Rellax",
};

export default function CareersPage() {
  return (
    <PageShell
      eyebrow="Company"
      title="Small team. Serious product."
      description="We are building a focused team around onboarding intelligence, workflow design, and applied AI."
    >
      <ContentBlock title="Open roles">
        <ul className="space-y-3">
          <li className="rounded-2xl bg-[var(--rellax-surface)] px-5 py-4">
            Senior Full-Stack Engineer
          </li>
          <li className="rounded-2xl bg-[var(--rellax-surface)] px-5 py-4">
            AI / ML Engineer
          </li>
          <li className="rounded-2xl bg-[var(--rellax-surface)] px-5 py-4">
            Product Designer
          </li>
        </ul>
      </ContentBlock>
      <ContentBlock title="How to apply">
        <p>Send your resume and a short note to careers@rellax.ai.</p>
      </ContentBlock>
    </PageShell>
  );
}
