type FooterLink = {
  label: string;
  href: string;
};

export const HERO_STATS = [
  { value: "3x", label: "Faster ramp-up" },
  { value: "94%", label: "Gap reduction" },
  { value: "0.4s", label: "Analysis time" },
];

export const VALUE_CARDS = [
  {
    id: "01",
    title: "Role-aware onboarding",
    description:
      "Every learning path is computed against the actual role, not a generic curriculum.",
  },
  {
    id: "02",
    title: "Resume to roadmap",
    description:
      "Upload a resume and convert existing capability into a concrete upskilling path instantly.",
  },
  {
    id: "03",
    title: "Progress you can trust",
    description:
      "Managers see where readiness is rising, where gaps remain, and what to do next.",
  },
];

export const PROCESS_STEPS = [
  {
    id: "01",
    title: "Upload resume",
    description:
      "The AI extracts skills, experience levels, and competency signals from any resume format.",
  },
  {
    id: "02",
    title: "Map to role",
    description:
      "Job descriptions are normalized against a shared skill taxonomy to define role expectations clearly.",
  },
  {
    id: "03",
    title: "Identify gaps",
    description:
      "RELLAX computes the delta between current and required skills with no manual scoring.",
  },
  {
    id: "04",
    title: "Generate path",
    description:
      "A sequenced roadmap is created around role importance, skill dependencies, and urgency.",
  },
];

export const FEATURE_SPLITS = [
  {
    eyebrow: "Employer dashboard",
    title: "Zero guesswork.",
    accent: "Total control.",
    description:
      "Define roles, import teams, and monitor competency progress from one operating surface.",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1000&auto=format&fit=crop&q=80",
    imageAlt: "Employer dashboard view",
    badge: "For employers",
    items: [
      "Role and JD management for every function",
      "Bulk employee onboarding through team imports",
      "Real-time visibility into readiness and skill coverage",
    ],
  },
  {
    eyebrow: "Employee experience",
    title: "No more generic",
    accent: "onboarding.",
    description:
      "Employees get a path tailored to what they already know and what their role actually needs.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&auto=format&fit=crop&q=80",
    imageAlt: "Employee learning path view",
    badge: "For employees",
    items: [
      "Resume upload with no manual profile setup",
      "Step-by-step learning sequences based on real gaps",
      "Progress tracking as modules close target competencies",
    ],
  },
];

export const ENGINE_SIGNALS = [
  "TypeScript ✓",
  "System Design ✓",
  "CI/CD Missing",
  "React Partial",
  "DevOps Missing",
];

export const ENGINE_METRICS = [
  { value: "82%", label: "System Design", tone: "bg-[var(--rellax-sage)]" },
  { value: "61%", label: "React / Next.js", tone: "bg-[var(--rellax-gold)]" },
  { value: "90%", label: "Data Structures", tone: "bg-[var(--rellax-slate)]" },
  { value: "48%", label: "TypeScript", tone: "bg-[#c0503c]" },
];

export const IMPACT_STATS = [
  { value: "3x", label: "Faster time to productivity" },
  { value: "94%", label: "Average gap reduction" },
  { value: "0s", label: "Manual configuration" },
];

export const PHOTO_GRID = [
  {
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop&q=80",
    alt: "Collaborative team",
    label: "Collaborative learning",
    large: true,
  },
  {
    src: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=700&auto=format&fit=crop&q=80",
    alt: "Modern workplace",
    label: "Modern onboarding",
  },
  {
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=700&auto=format&fit=crop&q=80",
    alt: "Strategy meeting",
    label: "Role readiness",
  },
  {
    src: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=700&auto=format&fit=crop&q=80",
    alt: "Office environment",
    label: "Enterprise scale",
  },
  {
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=700&auto=format&fit=crop&q=80",
    alt: "Developer at work",
    label: "Skill development",
  },
];

export const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how" },
      { label: "Features", href: "/#features" },
      { label: "AI Engine", href: "/#engine" },
      { label: "Early access", href: "/#cta" },
    ] satisfies FooterLink[],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ] satisfies FooterLink[],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Security", href: "/security" },
      { label: "Cookies", href: "/cookies" },
    ] satisfies FooterLink[],
  },
];
