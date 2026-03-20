import { EngineSection } from "@/components/home/engine-section";
import { FeatureSplitSection } from "@/components/home/feature-split-section";
import { HeroSection } from "@/components/home/hero-section";
import { PhotoGridSection } from "@/components/home/photo-grid-section";
import { ProcessSection } from "@/components/home/process-section";
import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { ValueStrip } from "@/components/home/value-strip";

export function HomePage() {
  return (
    <main className="bg-white text-[var(--rellax-ink)]">
      <SiteHeader />
      <HeroSection />
      <ValueStrip />
      <ProcessSection />
      <FeatureSplitSection />
      <EngineSection />
      <PhotoGridSection />
      <SiteFooter />
    </main>
  );
}
