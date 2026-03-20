"use client";

// ─── Font helpers ─────────────────────────────────────────────────────────────
const D = "var(--font-display)"; // Syne
const M = "var(--font-mono)";    // DM Mono

// ─── Navigation ──────────────────────────────────────────────────────────────

function Nav() {
  const links = [
    ["Problem", "#problem"],
    ["How It Works", "#how-it-works"],
    ["Engine", "#engine"],
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/[0.97] backdrop-blur-lg border-b border-black/[0.07]">
      <div className="max-w-[1120px] mx-auto px-6 xl:px-0 h-[60px] flex items-center justify-between">
        <a href="/" style={{ fontFamily: D }} className="text-[14px] font-extrabold tracking-tight">
          RELLAX
        </a>

        <nav className="hidden md:flex items-center gap-9">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              style={{ fontFamily: M }}
              className="text-[10.5px] uppercase tracking-[0.14em] text-neutral-400 hover:text-black transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </nav>

        <a
          href="#get-started"
          style={{ fontFamily: M }}
          className="text-[10.5px] uppercase tracking-[0.12em] border border-black px-5 py-[10px] hover:bg-black hover:text-white transition-colors duration-150"
        >
          Get Started
        </a>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const stats: [string, string][] = [
    ["3.1×", "Faster time to competency"],
    ["67%", "Reduction in onboarding cost"],
    ["94%", "New hire satisfaction rate"],
  ];

  return (
    <section className="pt-[168px] pb-[112px]">
      <div className="max-w-[1120px] mx-auto px-6 xl:px-0">
        {/* Centered copy */}
        <div className="max-w-[900px] mx-auto text-center">
          <p
            style={{ fontFamily: M }}
            className="text-[10px] uppercase tracking-[0.22em] text-neutral-400 mb-10 a1"
          >
            AI-Powered Onboarding
          </p>

          <h1
            style={{ fontFamily: D, lineHeight: 1.02, letterSpacing: "-0.03em" }}
            className="text-[62px] md:text-[86px] lg:text-[106px] font-extrabold text-[#0F0F0F] mb-8 a2"
          >
            Turn onboarding
            <br />
            into a personalized
            <br />
            <span className="text-neutral-300">skill journey.</span>
          </h1>

          <p
            style={{ fontFamily: D }}
            className="text-[17px] md:text-[18px] text-neutral-500 leading-relaxed max-w-[520px] mx-auto mb-12 a3"
          >
            AI-driven onboarding that maps every new hire&apos;s real capabilities to a
            custom learning path — so they reach full competency faster.
          </p>

          <div className="flex items-center justify-center gap-7 a4">
            <a
              href="#get-started"
              style={{ fontFamily: M }}
              className="text-[11px] uppercase tracking-[0.13em] bg-[#0F0F0F] text-white px-8 py-4 hover:bg-neutral-700 transition-colors duration-150"
            >
              Get Started
            </a>
            <a
              href="#how-it-works"
              style={{ fontFamily: M }}
              className="text-[11px] uppercase tracking-[0.13em] text-neutral-400 hover:text-black transition-colors duration-200 flex items-center gap-2"
            >
              See how it works <span>→</span>
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-24 border-t border-black/10 grid grid-cols-3 a5">
          {stats.map(([stat, label], i) => (
            <div
              key={stat}
              className={`pt-10 pb-2 text-center ${i < 2 ? "border-r border-black/10" : ""}`}
            >
              <p
                style={{ fontFamily: D, letterSpacing: "-0.035em" }}
                className="text-[40px] font-extrabold text-[#0F0F0F] leading-none mb-2"
              >
                {stat}
              </p>
              <p
                style={{ fontFamily: M }}
                className="text-[10px] uppercase tracking-[0.14em] text-neutral-400"
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Problem ──────────────────────────────────────────────────────────────────

const PROBLEMS = [
  {
    num: "01",
    title: "One-size-fits-all",
    body: "Every new hire gets the same deck, the same checklist, the same ramp — regardless of what they already know or where they actually need help.",
  },
  {
    num: "02",
    title: "No skill visibility",
    body: "Managers can't see real capability gaps. Training is assigned by role, not by the individual. Critical blindspots go unnoticed until it's too late.",
  },
  {
    num: "03",
    title: "Weeks wasted",
    body: "Senior hires sit through basics. Experts review content they mastered years ago. Top talent disengages — and some leave before they ever ship.",
  },
];

function Problem() {
  return (
    <section id="problem" className="border-t border-black/10">
      <div className="max-w-[1120px] mx-auto px-6 xl:px-0 py-[120px]">
        {/* Two-column header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 mb-20">
          <div>
            <p style={{ fontFamily: M }} className="text-[10px] uppercase tracking-[0.22em] text-neutral-400 mb-7">
              The Problem
            </p>
            <h2
              style={{ fontFamily: D, lineHeight: 1.04, letterSpacing: "-0.025em" }}
              className="text-[40px] md:text-[52px] font-extrabold"
            >
              Generic onboarding
              <br />
              is broken.
            </h2>
          </div>
          <div className="flex md:items-end">
            <p style={{ fontFamily: D }} className="text-[16px] text-neutral-500 leading-relaxed max-w-[400px]">
              Modern teams hire fast. But onboarding is still a relic — generic, slow,
              and completely disconnected from individual skill.
            </p>
          </div>
        </div>

        {/* Three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-black/10">
          {PROBLEMS.map(({ num, title, body }, i) => (
            <div
              key={num}
              className={[
                "pt-10 pb-12",
                i === 0 ? "md:pr-12 md:border-r border-black/10" : "",
                i === 1 ? "md:px-12 md:border-r border-black/10" : "",
                i === 2 ? "md:pl-12" : "",
              ].join(" ")}
            >
              <span
                style={{ fontFamily: M }}
                className="text-[10px] uppercase tracking-[0.18em] text-neutral-300 block mb-8"
              >
                {num}
              </span>
              <h3
                style={{ fontFamily: D, letterSpacing: "-0.02em" }}
                className="text-[21px] font-bold mb-4"
              >
                {title}
              </h3>
              <p style={{ fontFamily: D }} className="text-[15px] text-neutral-500 leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

const STEPS = [
  {
    num: "01",
    title: "Upload Resume",
    desc: "New hires upload their resume and complete a short skills intake. Takes under five minutes.",
  },
  {
    num: "02",
    title: "AI Analyzes",
    desc: "Our engine maps declared experience against verified skill benchmarks built for the specific role.",
  },
  {
    num: "03",
    title: "Get Learning Path",
    desc: "A personalized path covers only the gaps that matter — sequenced intelligently from fundamentals up.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-black/10 bg-[#F8F8F7]">
      <div className="max-w-[1120px] mx-auto px-6 xl:px-0 py-[120px]">
        <div className="mb-20">
          <p style={{ fontFamily: M }} className="text-[10px] uppercase tracking-[0.22em] text-neutral-400 mb-7">
            The Process
          </p>
          <h2
            style={{ fontFamily: D, lineHeight: 1.04, letterSpacing: "-0.025em" }}
            className="text-[40px] md:text-[52px] font-extrabold"
          >
            Three steps to
            <br />
            full competency.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-0">
          {STEPS.map(({ num, title, desc }, i) => (
            <div
              key={num}
              className={[
                i === 0 ? "md:pr-16 md:border-r border-black/10" : "",
                i === 1 ? "md:px-16 md:border-r border-black/10" : "",
                i === 2 ? "md:pl-16" : "",
              ].join(" ")}
            >
              <p
                style={{ fontFamily: M }}
                className="text-[10px] uppercase tracking-[0.18em] text-neutral-400 mb-8"
              >
                Step {num}
              </p>

              {/* Number box */}
              <div className="w-11 h-11 border border-black/20 flex items-center justify-center mb-8">
                <span style={{ fontFamily: M }} className="text-[12px] font-medium text-neutral-400">
                  {num}
                </span>
              </div>

              <h3
                style={{ fontFamily: D, letterSpacing: "-0.02em" }}
                className="text-[21px] font-bold mb-3"
              >
                {title}
              </h3>
              <p style={{ fontFamily: D }} className="text-[15px] text-neutral-500 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Core Engine ──────────────────────────────────────────────────────────────

const ENGINE_FEATURES = [
  {
    title: "Skill Graph Mapping",
    desc: "Each hire's resume is parsed into a structured skill graph and cross-referenced against role benchmarks built from thousands of real team profiles.",
  },
  {
    title: "Gap Detection",
    desc: "The AI identifies precise gaps — not just missing tools, but conceptual blindspots that surface as performance issues weeks into the role.",
  },
  {
    title: "Adaptive Sequencing",
    desc: "Content is ordered by skill dependency chains. Foundational gaps are closed before advanced concepts — never the reverse.",
  },
  {
    title: "Continuous Verification",
    desc: "Short embedded assessments confirm skills were absorbed, not just viewed. The path adjusts in real time based on verified mastery.",
  },
];

function Engine() {
  return (
    <section id="engine" className="border-t border-black/10">
      <div className="max-w-[1120px] mx-auto px-6 xl:px-0 py-[120px]">
        {/* Two-column header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 mb-20">
          <div>
            <p style={{ fontFamily: M }} className="text-[10px] uppercase tracking-[0.22em] text-neutral-400 mb-7">
              The Engine
            </p>
            <h2
              style={{ fontFamily: D, lineHeight: 1.04, letterSpacing: "-0.025em" }}
              className="text-[40px] md:text-[52px] font-extrabold"
            >
              Built on deep
              <br />
              skill intelligence.
            </h2>
          </div>
          <div className="flex md:items-end">
            <p style={{ fontFamily: D }} className="text-[16px] text-neutral-500 leading-relaxed max-w-[400px]">
              Rellax doesn&apos;t use generic AI prompts. The decision engine is purpose-built
              for skill inference, gap analysis, and learning path optimization.
            </p>
          </div>
        </div>

        {/* 2 × 2 feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-black/10">
          {ENGINE_FEATURES.map(({ title, desc }) => (
            <div
              key={title}
              className="border-b border-r border-black/10 p-10 group hover:bg-[#F8F8F7] transition-colors duration-200"
            >
              <div className="w-[7px] h-[7px] rounded-full bg-black mb-7 group-hover:bg-neutral-400 transition-colors duration-200" />
              <h3
                style={{ fontFamily: D, letterSpacing: "-0.015em" }}
                className="text-[19px] font-bold mb-3"
              >
                {title}
              </h3>
              <p style={{ fontFamily: D }} className="text-[15px] text-neutral-500 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTA() {
  return (
    <section id="get-started" className="bg-[#0F0F0F]">
      <div className="max-w-[1120px] mx-auto px-6 xl:px-0 py-[128px] text-center">
        <p
          style={{ fontFamily: M }}
          className="text-[10px] uppercase tracking-[0.22em] text-white/40 mb-10"
        >
          Get Started
        </p>
        <h2
          style={{ fontFamily: D, lineHeight: 1.03, letterSpacing: "-0.03em" }}
          className="text-[48px] md:text-[68px] lg:text-[84px] font-extrabold text-white mb-8"
        >
          Ready to transform
          <br />
          your onboarding?
        </h2>
        <p
          style={{ fontFamily: D }}
          className="text-[17px] text-white/40 leading-relaxed max-w-[420px] mx-auto mb-12"
        >
          Join teams who onboard faster, retain talent longer, and build skills that actually stick.
        </p>
        <a
          href="#"
          style={{ fontFamily: M }}
          className="inline-flex items-center text-[11px] uppercase tracking-[0.13em] border border-white text-white px-8 py-4 hover:bg-white hover:text-black transition-colors duration-150"
        >
          Get Started Free
        </a>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const links = ["Privacy", "Terms", "Contact"];

  return (
    <footer className="bg-[#0F0F0F] border-t border-white/[0.08]">
      <div className="max-w-[1120px] mx-auto px-6 xl:px-0 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <span style={{ fontFamily: D }} className="text-[13px] font-extrabold text-white tracking-tight">
          RELLAX
        </span>
        <p style={{ fontFamily: M }} className="text-[10px] uppercase tracking-[0.14em] text-white/30">
          © 2025 Rellax. All rights reserved.
        </p>
        <div className="flex items-center gap-8">
          {links.map((item) => (
            <a
              key={item}
              href="#"
              style={{ fontFamily: M }}
              className="text-[10px] uppercase tracking-[0.14em] text-white/30 hover:text-white/60 transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Engine />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
