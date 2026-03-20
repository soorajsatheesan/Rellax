import type { Metadata } from "next";

import { ContentBlock } from "@/components/pages/content-block";
import { PageShell } from "@/components/pages/page-shell";

export const metadata: Metadata = {
  title: "Terms | Rellax",
};

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Terms of service."
      description="The platform is licensed for internal onboarding and workforce readiness use."
    >
      <ContentBlock title="Usage">
        <p>
          Rellax grants customers a limited, non-exclusive right to use the
          platform for internal onboarding workflows.
        </p>
        <p>
          Customers retain ownership of their uploaded data. Rellax retains
          ownership of the software and platform design.
        </p>
      </ContentBlock>
    </PageShell>
  );
}
