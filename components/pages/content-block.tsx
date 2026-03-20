import type { ReactNode } from "react";

type ContentBlockProps = {
  title: string;
  children: ReactNode;
};

export function ContentBlock({ title, children }: ContentBlockProps) {
  return (
    <article className="rounded-[1.75rem] border border-black/6 bg-white p-6 shadow-[0_18px_50px_rgba(8,8,9,0.04)] sm:p-8">
      <h2 className="font-display text-3xl leading-tight text-[var(--rellax-ink)]">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-base leading-8 text-[var(--rellax-ink-soft)]">
        {children}
      </div>
    </article>
  );
}
