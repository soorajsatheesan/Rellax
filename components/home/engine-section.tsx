import { FadeIn } from "@/components/animations";
import { Container } from "@/components/global/container";
import { SectionHeading } from "@/components/global/section-heading";
import {
  ENGINE_METRICS,
  ENGINE_SIGNALS,
  IMPACT_STATS,
} from "@/components/home/data";

export function EngineSection() {
  return (
    <>
      <section className="bg-white py-24 sm:py-32">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <FadeIn direction="right">
            <div>
              <SectionHeading
                eyebrow="AI engine"
                title="Skill gap,"
                accent="computed instantly."
                description="The engine parses resumes, normalizes role requirements, and computes the exact delta between current capability and target readiness."
              />
              <div className="mt-8 flex flex-wrap gap-3">
                {ENGINE_SIGNALS.map((signal) => (
                  <span
                    key={signal}
                    className="rounded-full border border-black/6 bg-[var(--rellax-surface)] px-4 py-2 text-sm text-[var(--rellax-ink)]"
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={120}>
            <div className="rounded-[2rem] border border-black/6 bg-[var(--rellax-ink)] p-6 text-white shadow-[0_30px_80px_rgba(8,8,9,0.12)] sm:p-8">
              <div className="font-mono text-xs uppercase tracking-[0.24em] text-white/40">
                rellax / skill-analysis
              </div>
              <div className="mt-8 space-y-5">
                {ENGINE_METRICS.map((metric) => (
                  <div key={metric.label}>
                    <div className="mb-2 flex items-center justify-between text-sm text-white/70">
                      <span>{metric.label}</span>
                      <span>{metric.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div
                        className={["h-full rounded-full", metric.tone].join(" ")}
                        style={{ width: metric.value }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      <section
        id="engine"
        className="bg-[var(--rellax-ink)] py-24 text-white sm:py-32"
      >
        <Container>
          <SectionHeading
            eyebrow="The AI engine"
            title="Not a content platform."
            accent="A decision engine."
            description="RELLAX does not assign generic courses. It computes what is missing and prescribes the shortest route to competency."
            align="center"
            tone="light"
          />
          <div className="mx-auto mt-12 max-w-4xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
            <div className="font-mono text-lg tracking-[0.08em] text-white/80 sm:text-2xl">
              Gap = Required Skills - Existing Skills
            </div>
            <div className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-white/35">
              core algorithm · computed per employee · per role
            </div>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 md:grid-cols-3">
            {IMPACT_STATS.map((stat) => (
              <div key={stat.label} className="bg-white/5 p-8 text-center">
                <div className="font-display text-6xl">{stat.value}</div>
                <div className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-white/45">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
