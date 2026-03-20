"use client";

import { useState } from "react";

/* ─── data ───────────────────────────────────────────────────── */

const TRUST_LOGOS = [
  "Microsoft", "Airbnb", "Notion", "Stripe",
  "Figma", "Atlassian", "Shopify", "Vercel",
  "Microsoft", "Airbnb", "Notion", "Stripe",
  "Figma", "Atlassian", "Shopify", "Vercel",
];

const ROLES = [
  { icon: "⌥", title: "Software Engineer", count: "24 frameworks" },
  { icon: "◈", title: "Product Manager", count: "18 frameworks" },
  { icon: "◉", title: "Data Analyst", count: "16 frameworks" },
  { icon: "⬡", title: "UX Designer", count: "12 frameworks" },
  { icon: "⟡", title: "Sales Executive", count: "21 frameworks" },
  { icon: "◎", title: "DevOps Engineer", count: "19 frameworks" },
  { icon: "⌗", title: "Marketing Lead", count: "14 frameworks" },
  { icon: "⊕", title: "Customer Success", count: "11 frameworks" },
];

const FOR_HIRES = [
  {
    title: "Skip what you know",
    body: "Upload your résumé once. The AI maps your existing skills and removes every redundant module from your path.",
  },
  {
    title: "Learn at your level",
    body: "Modules adapt in real-time as you progress. If you ace a concept, the engine skips ahead automatically.",
  },
  {
    title: "Arrive ready",
    body: "Complete your path verified against real role benchmarks — not arbitrary checklists.",
  },
];

const FOR_EMPLOYERS = [
  {
    title: "No more one-size curricula",
    body: "Every hire gets a personalised path based on their actual profile, not a generic department template.",
  },
  {
    title: "Measurable competency",
    body: "Replace 'hours completed' with verified milestone data. Know exactly where every new hire stands.",
  },
  {
    title: "Faster time-to-productivity",
    body: "Teams using Rellax reach full productivity 3.1× faster than those on static onboarding programmes.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Upload or Diagnose",
    body: "Submit a résumé PDF or complete a 10-minute role diagnostic. Either path gives the AI enough signal to work with.",
  },
  {
    n: "2",
    title: "AI Builds Your Map",
    body: "The engine cross-references your profile against a role competency framework and generates a gap-only, sequenced path.",
  },
  {
    n: "3",
    title: "Learn. Verify. Ship.",
    body: "Work through your personal curriculum. Each milestone is verified before you advance. Arrive at day one already competent.",
  },
];

const STATS = [
  { value: "3.1×", label: "Faster time-to-competency" },
  { value: "67%", label: "Reduction in redundant training" },
  { value: "94%", label: "Module completion rate" },
  { value: "12k+", label: "Hires onboarded this year" },
];

const TESTIMONIALS = [
  {
    quote:
      "We went from a 6-week onboarding programme to 11 days. The AI correctly identified that our senior engineers were sitting through content they'd mastered years ago.",
    name: "Layla R.",
    role: "VP of People Ops",
    company: "Cascade",
    rating: 5,
  },
  {
    quote:
      "As a career-changer I was terrified I'd fall behind. Instead the diagnostic found exactly what I needed, and I never once felt overwhelmed — just challenged at the right level.",
    name: "James O.",
    role: "Junior Data Analyst",
    company: "Fintrack",
    rating: 5,
  },
  {
    quote:
      "Our L&D spend dropped 40% in the first quarter and new-hire performance scores went up. The ROI was immediate and measurable.",
    name: "Priya K.",
    role: "Chief People Officer",
    company: "Stackline",
    rating: 5,
  },
];

/* ─── shared wrapper ─────────────────────────────────────────── */

const W: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children, style,
}) => (
  <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px", ...style }}>
    {children}
  </div>
);

/* ─── nav ────────────────────────────────────────────────────── */

function Nav() {
  return (
    <header style={{ borderBottom: "2px solid #0F0F0F", background: "#fff", position: "sticky", top: 0, zIndex: 100 }}>
      <W style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68, padding: "0 40px" }}>

        {/* logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 30, height: 30, background: "#14A800", border: "2px solid #0F0F0F", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.95rem", color: "#fff", lineHeight: 1 }}>R</span>
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.35rem", letterSpacing: "0.06em", color: "#0F0F0F" }}>RELLAX</span>
        </a>

        {/* links */}
        <nav style={{ display: "flex", gap: 32, fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.09em" }} className="hidden md:flex">
          {[["Features", "#features"], ["How It Works", "#how-it-works"], ["Roles", "#roles"], ["Pricing", "#pricing"], ["Enterprise", "#enterprise"]].map(([l, h]) => (
            <a key={l} href={h} style={{ color: "#444", textDecoration: "none" }}
              onMouseEnter={e => (e.target as HTMLElement).style.color = "#0F0F0F"}
              onMouseLeave={e => (e.target as HTMLElement).style.color = "#444"}>{l}</a>
          ))}
        </nav>

        {/* ctas */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a href="#" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#0F0F0F", textDecoration: "none" }}>Log In</a>
          <a href="#" className="btn btn-primary" style={{ padding: "11px 22px", fontSize: "0.75rem" }}>Sign Up Free</a>
        </div>
      </W>
    </header>
  );
}

/* ─── hero ───────────────────────────────────────────────────── */

function Hero() {
  const [role, setRole] = useState("");

  return (
    <section style={{ padding: "100px 0 80px", background: "#fff" }}>
      <W style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>

        <div className="a1 tag tag-green" style={{ marginBottom: 24 }}>
          AI-Powered Onboarding Engine
        </div>

        <h1
          className="a2"
          style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "clamp(2.8rem, 6.5vw, 5.6rem)", lineHeight: 1.06,
            letterSpacing: "-0.01em", color: "#0F0F0F",
            maxWidth: 820, marginBottom: 24,
          }}
        >
          Onboarding that meets every hire{" "}
          <span style={{ color: "#14A800", position: "relative", display: "inline-block" }}>
            exactly where they are.
            <svg style={{ position: "absolute", bottom: -4, left: 0, width: "100%", height: 4 }} viewBox="0 0 100 4" preserveAspectRatio="none">
              <path d="M0 3 Q50 0 100 3" stroke="#FFE500" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        <p className="a3" style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", lineHeight: 1.8, color: "#555", maxWidth: 540, marginBottom: 40 }}>
          Rellax AI reads your résumé or runs a diagnostic, then builds a
          personalised training path that skips what you know and targets
          only your real gaps.
        </p>

        {/* search bar */}
        <div className="a4" style={{ display: "flex", width: "100%", maxWidth: 580, border: "2px solid #0F0F0F", boxShadow: "4px 4px 0 #0F0F0F", marginBottom: 16 }}>
          <input
            className="nb-input"
            style={{ border: "none", boxShadow: "none", flex: 1, padding: "16px 20px", fontSize: "0.9rem" }}
            placeholder="Enter your role — e.g. Product Manager"
            value={role}
            onChange={e => setRole(e.target.value)}
          />
          <button
            className="btn btn-primary"
            style={{ border: "none", borderLeft: "2px solid #0F0F0F", boxShadow: "none", borderRadius: 0, padding: "0 28px", fontSize: "0.78rem", transform: "none" }}
          >
            Generate Path
          </button>
        </div>

        <div className="a4" style={{ display: "flex", gap: 24, fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#888", marginBottom: 0 }}>
          <span>→ Upload résumé instead</span>
          <span>→ Take the diagnostic</span>
          <span>→ Explore by role</span>
        </div>
      </W>
    </section>
  );
}

/* ─── trust strip ────────────────────────────────────────────── */

function TrustStrip() {
  return (
    <div style={{ borderTop: "2px solid #0F0F0F", borderBottom: "2px solid #0F0F0F", background: "#F7F7F5", padding: "20px 0", overflow: "hidden" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px", marginBottom: 12 }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "#999", textAlign: "center" }}>
          Trusted by teams at
        </p>
      </div>
      <div className="marquee-track" style={{ paddingTop: 12 }}>
        {TRUST_LOGOS.map((logo, i) => (
          <div key={i} style={{ padding: "0 48px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", color: "#bbb", letterSpacing: "0.04em", flexShrink: 0 }}>
            {logo.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── browse roles ───────────────────────────────────────────── */

function BrowseRoles() {
  return (
    <section id="roles" style={{ padding: "80px 0", background: "#fff", borderTop: "2px solid #0F0F0F" }}>
      <W>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
          <div>
            <span className="label">Browse by Role</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(1.8rem, 3vw, 2.6rem)", letterSpacing: "-0.01em", color: "#0F0F0F" }}>
              Find your path
            </h2>
          </div>
          <a href="#" style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 600, color: "#14A800", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "2px solid #14A800", paddingBottom: 2 }}>
            View all roles →
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
          {ROLES.map((r, i) => (
            <a
              key={i}
              href="#"
              className="card card-shadow card-hover"
              style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 14, textDecoration: "none", cursor: "pointer" }}
            >
              <div style={{ width: 40, height: 40, background: "#F7F7F5", border: "2px solid #0F0F0F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", color: "#14A800" }}>
                {r.icon}
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "#0F0F0F", marginBottom: 4 }}>
                  {r.title}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#888" }}>
                  {r.count}
                </div>
              </div>
            </a>
          ))}
        </div>
      </W>
    </section>
  );
}

/* ─── dual value prop ────────────────────────────────────────── */

function DualValue() {
  const [tab, setTab] = useState<"hires" | "employers">("hires");
  const items = tab === "hires" ? FOR_HIRES : FOR_EMPLOYERS;

  return (
    <section id="features" style={{ background: "#F7F7F5", borderTop: "2px solid #0F0F0F", padding: "80px 0" }}>
      <W>
        {/* tab switcher */}
        <div style={{ display: "flex", gap: 0, marginBottom: 56, border: "2px solid #0F0F0F", width: "fit-content", boxShadow: "4px 4px 0 #0F0F0F" }}>
          {(["hires", "employers"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "13px 32px",
                fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.08em",
                background: tab === t ? "#0F0F0F" : "#fff",
                color: tab === t ? "#FFE500" : "#666",
                border: "none", cursor: "pointer",
                borderRight: t === "hires" ? "2px solid #0F0F0F" : "none",
                transition: "all .15s ease",
              }}
            >
              {t === "hires" ? "For New Hires" : "For Employers"}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          {/* left — headline */}
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2rem, 3.5vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.01em", color: "#0F0F0F", marginBottom: 24 }}>
              {tab === "hires"
                ? <>A training path built for <span style={{ color: "#14A800" }}>you specifically.</span></>
                : <>Onboarding that actually <span style={{ color: "#14A800" }}>scales with you.</span></>
              }
            </h2>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.88rem", lineHeight: 1.8, color: "#555", marginBottom: 32 }}>
              {tab === "hires"
                ? "No more sitting through content you mastered three jobs ago. Rellax reads where you are and builds a curriculum that starts there."
                : "Replace static PDFs and all-hands sessions with a system that adapts to every hire's actual baseline — automatically."
              }
            </p>
            <a href="#" className="btn btn-primary">
              {tab === "hires" ? "Start Your Path →" : "Get a Demo →"}
            </a>
          </div>

          {/* right — feature list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "2px solid #0F0F0F", background: "#fff", boxShadow: "6px 6px 0 #0F0F0F" }}>
            {items.map((item, i) => (
              <div key={i} style={{ padding: "28px 32px", borderBottom: i < items.length - 1 ? "2px solid #e8e8e8" : "none", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, background: "#E6F9E3", border: "2px solid #14A800", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <span style={{ color: "#14A800", fontSize: "0.75rem", fontWeight: 800 }}>✓</span>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: "#0F0F0F", marginBottom: 6 }}>{item.title}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", lineHeight: 1.7, color: "#666" }}>{item.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </W>
    </section>
  );
}

/* ─── stats bar ──────────────────────────────────────────────── */

function StatsBar() {
  return (
    <div style={{ background: "#0F0F0F", borderTop: "2px solid #0F0F0F" }}>
      <W style={{ padding: 0, maxWidth: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding: "52px 0",
              textAlign: "center",
              borderRight: i < STATS.length - 1 ? "2px solid #2a2a2a" : "none",
            }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.2rem, 3.5vw, 3.4rem)", color: i === 0 ? "#FFE500" : "#14A800", lineHeight: 1, marginBottom: 10 }}>
                {s.value}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.1em", lineHeight: 1.5 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </W>
    </div>
  );
}

/* ─── how it works ───────────────────────────────────────────── */

function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: "88px 0", background: "#fff", borderTop: "2px solid #0F0F0F" }}>
      <W>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="label">How It Works</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "-0.01em", color: "#0F0F0F" }}>
            From résumé to{" "}
            <span style={{ color: "#14A800" }}>role-ready</span>{" "}
            in three steps.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, border: "2px solid #0F0F0F", boxShadow: "6px 6px 0 #0F0F0F" }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{
              padding: "48px 36px",
              background: i === 1 ? "#0F0F0F" : "#fff",
              borderRight: i < STEPS.length - 1 ? "2px solid #0F0F0F" : "none",
            }}>
              <div style={{
                width: 44, height: 44, border: `2px solid ${i === 1 ? "#FFE500" : "#0F0F0F"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: 700,
                color: i === 1 ? "#FFE500" : "#0F0F0F", marginBottom: 28,
                background: i === 1 ? "transparent" : "#F7F7F5",
              }}>
                {step.n}
              </div>
              <h3 style={{
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem",
                color: i === 1 ? "#fff" : "#0F0F0F", marginBottom: 14,
              }}>
                {step.title}
              </h3>
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: "0.84rem", lineHeight: 1.75,
                color: i === 1 ? "#888" : "#555",
              }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </W>
    </section>
  );
}

/* ─── testimonials ───────────────────────────────────────────── */

function Testimonials() {
  return (
    <section style={{ background: "#F7F7F5", borderTop: "2px solid #0F0F0F", padding: "88px 0" }}>
      <W>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <span className="label">What They Say</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "-0.01em", color: "#0F0F0F" }}>
            Real results. Real people.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="card card-shadow" style={{ padding: "36px", background: "#fff" }}>
              {/* stars */}
              <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} style={{ color: "#FFE500", fontSize: "0.9rem" }}>★</span>
                ))}
              </div>

              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", lineHeight: 1.8, color: "#333", marginBottom: 28, flex: 1 }}>
                "{t.quote}"
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 14, paddingTop: 24, borderTop: "1.5px solid #e8e8e8" }}>
                <div style={{
                  width: 40, height: 40, border: "2px solid #0F0F0F",
                  background: i === 0 ? "#14A800" : i === 1 ? "#FFE500" : "#0F0F0F",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem",
                  color: i === 1 ? "#0F0F0F" : "#fff", flexShrink: 0,
                }}>
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem", color: "#0F0F0F" }}>{t.name}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#888" }}>{t.role} · {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </W>
    </section>
  );
}

/* ─── enterprise CTA ─────────────────────────────────────────── */

function Enterprise() {
  return (
    <section id="enterprise" style={{ borderTop: "2px solid #0F0F0F", padding: "88px 0", background: "#fff" }}>
      <W>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          {/* left */}
          <div>
            <span className="label">For Enterprise</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "-0.01em", color: "#0F0F0F", marginBottom: 20 }}>
              Built to scale across{" "}
              <span style={{ color: "#14A800" }}>your entire org.</span>
            </h2>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.88rem", lineHeight: 1.8, color: "#555", marginBottom: 36 }}>
              SOC 2 Type II certified. GDPR compliant. SSO/SAML ready.
              White-label available. Dedicated CSM included. Rellax fits into
              your existing HR stack — not the other way around.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a href="#" className="btn btn-primary">Contact Sales</a>
              <a href="#" className="btn btn-outline">View Security Docs</a>
            </div>
          </div>

          {/* right — checklist card */}
          <div style={{ border: "2px solid #0F0F0F", boxShadow: "6px 6px 0 #0F0F0F", background: "#F7F7F5" }}>
            {[
              ["SSO / SAML integration", "Connect to Okta, Azure AD, and more"],
              ["Custom AI fine-tuning", "Train on your own internal content library"],
              ["White-label portal", "Your brand, your domain, your experience"],
              ["Advanced analytics", "Cohort reporting, competency dashboards, exports"],
              ["Dedicated support", "Onboarding specialist + SLA guarantee"],
            ].map(([title, desc], i) => (
              <div key={i} style={{ padding: "22px 28px", borderBottom: i < 4 ? "2px solid #e8e8e8" : "none", display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ width: 22, height: 22, background: "#E6F9E3", border: "2px solid #14A800", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <span style={{ color: "#14A800", fontSize: "0.65rem", fontWeight: 800 }}>✓</span>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.92rem", color: "#0F0F0F", marginBottom: 3 }}>{title}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#888", lineHeight: 1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </W>
    </section>
  );
}

/* ─── pricing ────────────────────────────────────────────────── */

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    sub: "Up to 10 hires / month",
    tag: null,
    dark: false,
    features: ["Résumé parsing (PDF)", "3 role frameworks", "Pre-built module library", "Basic analytics"],
    cta: "Get Started Free",
    ctaClass: "btn-outline",
  },
  {
    name: "Team",
    price: "$18",
    sub: "per hire / month",
    tag: "Most Popular",
    dark: true,
    features: ["Unlimited hires", "All role frameworks", "Custom module upload", "Real-time path adjustment", "Competency reports", "HRIS integrations"],
    cta: "Start Free Trial",
    ctaClass: "btn-yellow",
  },
  {
    name: "Enterprise",
    price: "Custom",
    sub: "Tailored to your org",
    tag: null,
    dark: false,
    features: ["SSO / SAML", "Custom AI fine-tuning", "White-label portal", "SLA + dedicated CSM"],
    cta: "Talk to Sales",
    ctaClass: "btn-primary",
  },
] as const;

function Pricing() {
  return (
    <section id="pricing" style={{ borderTop: "2px solid #0F0F0F", padding: "88px 0", background: "#F7F7F5" }}>
      <W>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <span className="label">Pricing</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "-0.01em", color: "#0F0F0F", marginBottom: 12 }}>
            Simple, transparent pricing.
          </h2>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#888" }}>
            Start free. Scale when you're ready. No surprises.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {PLANS.map((plan) => (
            <div key={plan.name} style={{
              border: "2px solid #0F0F0F",
              boxShadow: plan.dark ? "6px 6px 0 #0F0F0F" : "4px 4px 0 #0F0F0F",
              background: plan.dark ? "#0F0F0F" : "#fff",
              padding: "40px 32px",
              position: "relative",
            }}>
              {plan.tag && (
                <div style={{
                  position: "absolute", top: -13, left: 28,
                  background: "#FFE500", border: "2px solid #0F0F0F",
                  padding: "3px 12px", fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase",
                  letterSpacing: "0.1em", color: "#0F0F0F",
                }}>
                  {plan.tag}
                </div>
              )}

              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: plan.dark ? "#888" : "#999", marginBottom: 16 }}>
                {plan.name}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "3rem", lineHeight: 1, color: plan.dark ? "#FFE500" : "#0F0F0F", marginBottom: 4 }}>
                {plan.price}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: plan.dark ? "#555" : "#aaa", marginBottom: 32, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {plan.sub}
              </div>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 32, paddingTop: 24, borderTop: `2px solid ${plan.dark ? "#2a2a2a" : "#e8e8e8"}` }}>
                {plan.features.map(feat => (
                  <li key={feat} style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", display: "flex", alignItems: "flex-start", gap: 10, color: plan.dark ? "#bbb" : "#444", lineHeight: 1.5 }}>
                    <span style={{ color: "#14A800", fontSize: "0.7rem", fontWeight: 800, marginTop: 1, flexShrink: 0 }}>✓</span>
                    {feat}
                  </li>
                ))}
              </ul>

              <a href="#" className={`btn ${plan.ctaClass}`} style={{ width: "100%", justifyContent: "center" }}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </W>
    </section>
  );
}

/* ─── final CTA ──────────────────────────────────────────────── */

function FinalCTA() {
  return (
    <section style={{ background: "#14A800", borderTop: "2px solid #0F0F0F", padding: "100px 0" }}>
      <W style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        <span className="label" style={{ color: "rgba(255,255,255,0.6)", marginBottom: 20 }}>Get Started Today</span>
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "clamp(2.4rem, 5vw, 4.4rem)", lineHeight: 1.05,
          letterSpacing: "-0.01em", color: "#fff", maxWidth: 720, marginBottom: 24,
        }}>
          Stop wasting your best people's time on onboarding they don't need.
        </h2>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(255,255,255,0.75)", maxWidth: 480, marginBottom: 40 }}>
          Join 8,400+ teams who replaced static curricula with AI-adaptive
          paths. Free forever. No credit card required.
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          <a href="#" className="btn" style={{ background: "#fff", color: "#0F0F0F", border: "2px solid #fff", boxShadow: "4px 4px 0 rgba(0,0,0,0.25)" }}>
            Start Free — No Card →
          </a>
          <a href="#" className="btn" style={{ background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,0.5)", boxShadow: "4px 4px 0 rgba(0,0,0,0.2)" }}>
            Book a Demo
          </a>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", marginTop: 24, textTransform: "uppercase", letterSpacing: "0.1em" }}>
          GDPR compliant · SOC 2 Type II · No credit card required
        </div>
      </W>
    </section>
  );
}

/* ─── footer ─────────────────────────────────────────────────── */

function Footer() {
  const cols = [
    { title: "Product", links: ["Features", "Integrations", "Security", "Changelog", "Status"] },
    { title: "For Teams", links: ["HR Leaders", "L&D Teams", "Managers", "Case Studies", "Blog"] },
    { title: "Company", links: ["About", "Careers", "Press", "Partners", "Contact"] },
    { title: "Legal", links: ["Privacy", "Terms", "Cookie Policy", "GDPR"] },
  ];

  return (
    <footer style={{ background: "#0F0F0F", borderTop: "2px solid #0F0F0F", padding: "64px 0 40px" }}>
      <W>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(4, 1fr)", gap: 40, marginBottom: 56 }}>
          {/* brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, background: "#14A800", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.9rem", color: "#fff", lineHeight: 1 }}>R</span>
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.2rem", letterSpacing: "0.06em", color: "#fff" }}>RELLAX</span>
            </div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#555", lineHeight: 1.7, maxWidth: 200 }}>
              Adaptive onboarding that meets every hire exactly where they are.
            </p>
          </div>

          {/* link columns */}
          {cols.map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "#555", marginBottom: 16 }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(l => (
                  <a key={l} href="#" style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "#555", textDecoration: "none" }}
                    onMouseEnter={e => (e.target as HTMLElement).style.color = "#fff"}
                    onMouseLeave={e => (e.target as HTMLElement).style.color = "#555"}>
                    {l}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ paddingTop: 28, borderTop: "2px solid #1e1e1e", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "#444" }}>
            © 2026 Rellax AI Inc. All rights reserved.
          </span>
          <div style={{ display: "flex", gap: 20 }}>
            {["Twitter / X", "LinkedIn", "GitHub"].map(s => (
              <a key={s} href="#" style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "#444", textDecoration: "none" }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = "#14A800"}
                onMouseLeave={e => (e.target as HTMLElement).style.color = "#444"}>
                {s}
              </a>
            ))}
          </div>
        </div>
      </W>
    </footer>
  );
}

/* ─── page ───────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Nav />
      <Hero />
      <TrustStrip />
      <BrowseRoles />
      <DualValue />
      <StatsBar />
      <HowItWorks />
      <Testimonials />
      <Enterprise />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}
