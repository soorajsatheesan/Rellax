import { FadeIn } from "@/components/animations";
import { Container } from "@/components/global/container";
import { SectionHeading } from "@/components/global/section-heading";
import { PROCESS_STEPS } from "@/components/home/data";

export function ProcessSection() {
  return (
    <section id="how" className="bg-[var(--rellax-surface)] py-24 sm:py-32">
      <Container>
        <FadeIn>
          <SectionHeading
            eyebrow="How it works"
            title="A precise path from signal to"
            accent="readiness."
            description="RELLAX reduces onboarding to a clean sequence: read the signal, compute the gap, and generate the shortest path to role fit."
          />
        </FadeIn>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {PROCESS_STEPS.map((step, index) => (
            <FadeIn key={step.id} delay={index * 80}>
            <article
              className="h-full rounded-[1.5rem] border border-black/6 bg-white p-6 shadow-[0_20px_60px_rgba(8,8,9,0.04)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(8,8,9,0.08)]"
            >
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[var(--rellax-ink-muted)]">
                {step.id}
              </div>
              <h3 className="mt-5 text-xl font-medium text-[var(--rellax-ink)]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--rellax-ink-soft)]">
                {step.description}
              </p>
            </article>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
