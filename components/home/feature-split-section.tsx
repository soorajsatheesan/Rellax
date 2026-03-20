import Image from "next/image";

import { FadeIn } from "@/components/animations";
import { Container } from "@/components/global/container";
import { FEATURE_SPLITS } from "@/components/home/data";

export function FeatureSplitSection() {
  return (
    <section id="features" className="bg-white py-24 sm:py-32">
      <Container className="space-y-16">
        {FEATURE_SPLITS.map((feature, index) => (
          <FadeIn key={feature.eyebrow} direction="up" delay={index * 60}>
          <div
            className={[
              "grid overflow-hidden rounded-[2rem] border border-black/6 bg-[var(--rellax-surface)]",
              "lg:grid-cols-2",
            ].join(" ")}
          >
            <FadeIn direction={index % 2 === 0 ? "left" : "right"} delay={index * 60 + 100}>
            <div className={["h-full", index % 2 === 1 ? "lg:order-2" : ""].filter(Boolean).join(" ")}>
              <div className="relative min-h-[340px] lg:min-h-full">
                <Image
                  src={feature.image}
                  alt={feature.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] backdrop-blur">
                    {feature.badge}
                  </div>
                  <h3 className="font-display text-4xl leading-none">
                    {feature.title}
                    <span className="block text-white/60">{feature.accent}</span>
                  </h3>
                </div>
              </div>
            </div>
            </FadeIn>
            <FadeIn direction={index % 2 === 0 ? "right" : "left"} delay={index * 60 + 160}>
            <div className="p-8 sm:p-12">
              <div className="inline-flex rounded-full border border-black/6 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--rellax-ink-muted)]">
                {feature.eyebrow}
              </div>
              <h3 className="mt-6 font-display text-4xl leading-tight text-[var(--rellax-ink)]">
                {feature.title}{" "}
                <span className="text-[var(--rellax-sage)]">{feature.accent}</span>
              </h3>
              <p className="mt-4 max-w-xl text-base leading-8 text-[var(--rellax-ink-soft)]">
                {feature.description}
              </p>
              <ul className="mt-8 space-y-4">
                {feature.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-black/6 bg-white px-5 py-4 text-sm leading-7 text-[var(--rellax-ink)] transition-colors hover:bg-[var(--rellax-surface-2)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            </FadeIn>
          </div>
          </FadeIn>
        ))}
      </Container>
    </section>
  );
}
