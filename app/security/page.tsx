import type { Metadata } from "next";

import { ContentBlock } from "@/components/pages/content-block";
import { PageShell } from "@/components/pages/page-shell";

export const metadata: Metadata = {
  title: "Security | Rellax",
};

export default function SecurityPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Security is foundational."
      description="Rellax handles sensitive employee data and is designed with that responsibility in mind."
    >
      <ContentBlock title="Security posture">
        <p>Data is encrypted in transit and at rest.</p>
        <p>
          Dependency reviews, infrastructure hardening, and regular audits are
          part of the operating baseline.
        </p>
      </ContentBlock>
    </PageShell>
  );
}
