import type { Metadata } from "next";

import { ContentBlock } from "@/components/pages/content-block";
import { PageShell } from "@/components/pages/page-shell";

export const metadata: Metadata = {
  title: "About | Rellax",
};

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="Company"
      title="Rellax exists to make onboarding precise."
      description="We build role-aware onboarding systems that respect what people already know and focus attention on what actually closes readiness gaps."
    >
      <ContentBlock title="Why we built it">
        <p>
          Most onboarding programs are still static. Experienced hires waste
          time, early-career hires get overwhelmed, and managers still do not
          know whether a new teammate is actually ready.
        </p>
        <p>
          Rellax turns onboarding into a decision system: read the employee
          signal, map it to the role, compute the delta, and prescribe the next
          step with clarity.
        </p>
      </ContentBlock>
      <ContentBlock title="What we believe">
        <p>
          Onboarding should be measurable, individualized, and operationally
          simple for teams running at scale.
        </p>
      </ContentBlock>
    </PageShell>
  );
}
