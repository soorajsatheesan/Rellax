import { Button } from "@/components/global/button";
import { Container } from "@/components/global/container";
import { HERO_STATS } from "@/components/home/data";
import styles from "@/components/home/home-page.module.css";

export function HeroSection() {
  return (
    <section id="top" className={styles.heroSection}>
      <div className={styles.heroBackground} />
      <div className={styles.heroScrim} />
      <Container className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col justify-center py-24">
        <div className="max-w-3xl">
          <div className="a1 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/80 backdrop-blur">
            <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(74,222,128,0.18)]" />
            AI onboarding engine
          </div>
          <h1 className="a2 mt-8 font-display text-5xl leading-none text-white sm:text-7xl">
            Adaptive onboarding for
            <span className="block text-white/70">modern teams.</span>
          </h1>
          <p className="a3 mt-8 max-w-2xl text-lg leading-8 text-white/70">
            RELLAX maps every employee&apos;s real capabilities to the exact
            skills their role needs next, then generates a personalized path to
            competency.
          </p>
          <div className="a4 mt-10 flex flex-wrap gap-4">
            <Button href="/signup" className="bg-white !text-[var(--rellax-ink)]">
              Sign up or sign in as employer
            </Button>
            <Button
              href="/login?view=employee"
              variant="secondary"
              className="border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/15"
            >
              Log in as employee
            </Button>
          </div>
        </div>

        <div className="a5 mt-16 grid gap-6 sm:grid-cols-3 sm:gap-10">
          {HERO_STATS.map((stat) => (
            <div key={stat.label} className="text-white">
              <div className="font-display text-4xl">{stat.value}</div>
              <div className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-white/45">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
