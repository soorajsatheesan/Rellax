import { FadeIn } from "@/components/animations";
import { Container } from "@/components/global/container";
import { VALUE_CARDS } from "@/components/home/data";

export function ValueStrip() {
  return (
    <section className="border-y border-black/6 bg-white">
      <Container className="grid gap-px bg-black/6 md:grid-cols-3">
        {VALUE_CARDS.map((card, index) => (
          <FadeIn key={card.id} delay={index * 80} className="bg-white">
          <article
            className="h-full px-6 py-10 transition hover:bg-[var(--rellax-surface)] sm:px-8"
          >
            <div className="font-mono text-[0.7rem] uppercase tracking-[0.24em] text-[var(--rellax-ink-muted)]">
              {card.id}
            </div>
            <h3 className="mt-6 font-display text-3xl leading-tight text-[var(--rellax-ink)]">
              {card.title}
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--rellax-ink-soft)]">
              {card.description}
            </p>
          </article>
          </FadeIn>
        ))}
      </Container>
    </section>
  );
}
