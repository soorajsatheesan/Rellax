import type { Metadata } from "next";

import { ContentBlock } from "@/components/pages/content-block";
import { PageShell } from "@/components/pages/page-shell";

export const metadata: Metadata = {
  title: "Privacy | Rellax",
};

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Privacy at Rellax."
      description="We treat employee and candidate data as sensitive operational data, not marketing inventory."
    >
      <ContentBlock title="Data handling">
        <p>
          We collect only the information needed to deliver onboarding workflows
          and compute readiness paths.
        </p>
        <p>
          Resume data is processed to extract skill signals and is used only for
          role mapping and learning path generation.
        </p>
      </ContentBlock>
    </PageShell>
  );
}
