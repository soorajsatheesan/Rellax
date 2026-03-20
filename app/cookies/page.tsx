import type { Metadata } from "next";

import { ContentBlock } from "@/components/pages/content-block";
import { PageShell } from "@/components/pages/page-shell";

export const metadata: Metadata = {
  title: "Cookies | Rellax",
};

export default function CookiesPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Cookie policy."
      description="Only the minimum set of cookies required for secure product operation should exist by default."
    >
      <ContentBlock title="Cookie use">
        <p>Strictly necessary cookies support session security and authentication.</p>
        <p>
          Functional and analytics cookies should remain limited and privacy
          preserving.
        </p>
      </ContentBlock>
    </PageShell>
  );
}
