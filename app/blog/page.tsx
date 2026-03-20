import type { Metadata } from "next";

import { ContentBlock } from "@/components/pages/content-block";
import { PageShell } from "@/components/pages/page-shell";

export const metadata: Metadata = {
  title: "Blog | Rellax",
};

const POSTS = [
  "How Rellax computes skill gaps in under a second",
  "The real cost of one-size-fits-all onboarding",
  "Building a skill taxonomy that works at scale",
];

export default function BlogPage() {
  return (
    <PageShell
      eyebrow="Company"
      title="Writing from the Rellax team."
      description="Research, product thinking, and engineering notes about adaptive onboarding systems."
    >
      <ContentBlock title="Recent posts">
        <ul className="space-y-3">
          {POSTS.map((post) => (
            <li key={post} className="rounded-2xl bg-[var(--rellax-surface)] px-5 py-4">
              {post}
            </li>
          ))}
        </ul>
      </ContentBlock>
    </PageShell>
  );
}
