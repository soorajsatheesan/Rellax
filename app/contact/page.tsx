import type { Metadata } from "next";

import { ContentBlock } from "@/components/pages/content-block";
import { PageShell } from "@/components/pages/page-shell";

export const metadata: Metadata = {
  title: "Contact | Rellax",
};

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="Company"
      title="Talk to the Rellax team."
      description="Questions, partnerships, and implementation discussions all start here."
    >
      <ContentBlock title="Contact">
        <p>Email hello@rellax.ai for product, sales, or partnership enquiries.</p>
        <p>We usually respond within one business day.</p>
      </ContentBlock>
    </PageShell>
  );
}
