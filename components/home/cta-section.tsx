import { Container } from "@/components/global/container";

export function CtaSection() {
  return (
    <section id="cta" className="bg-white py-24 sm:py-32">
      <Container className="rounded-[2rem] border border-black/6 bg-[linear-gradient(180deg,#f7f6f3_0%,#ffffff_100%)] px-6 py-14 text-center shadow-[0_30px_80px_rgba(8,8,9,0.05)] sm:px-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(156,122,60,0.18)] bg-[var(--rellax-gold-muted)] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[var(--rellax-gold)]">
          <span className="size-2 rounded-full bg-[var(--rellax-gold)]" />
          Early access open now
        </div>
        <h2 className="mt-8 font-display text-4xl leading-tight text-[var(--rellax-ink)] sm:text-6xl">
          Transform how your team
          <span className="block text-[var(--rellax-sage)]">onboards.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[var(--rellax-ink-soft)]">
          Join organizations using RELLAX to turn onboarding into a precise,
          role-aware system instead of a generic checklist.
        </p>
        <form className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="Work email address"
            className="min-w-0 flex-1 rounded-full border border-black/8 bg-white px-5 py-4 text-sm outline-none transition focus:border-[var(--rellax-sage)]"
          />
          <button
            type="submit"
            className="rounded-full bg-[var(--rellax-sage)] px-6 py-4 text-sm font-medium text-white transition hover:-translate-y-0.5"
          >
            Get access
          </button>
        </form>
        <p className="mt-4 text-sm text-[var(--rellax-ink-muted)]">
          No credit card required · Set up in minutes
        </p>
      </Container>
    </section>
  );
}
