type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  accent?: string;
  description: string;
  align?: "left" | "center";
  /** Use "light" when the section background is dark. Defaults to "dark". */
  tone?: "dark" | "light";
};

const STYLES = {
  dark: {
    eyebrow: "border-[var(--rellax-line)] bg-white/70 text-[var(--rellax-ink-muted)]",
    heading: "text-[var(--rellax-ink)]",
    description: "text-[var(--rellax-ink-soft)]",
  },
  light: {
    eyebrow: "border-white/15 bg-white/10 text-white/60",
    heading: "text-white",
    description: "text-white/60",
  },
} as const;

export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = "left",
  tone = "dark",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  const s = STYLES[tone];

  return (
    <div className={["max-w-2xl", alignment].join(" ")}>
      <span className={["mb-4 inline-flex rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em]", s.eyebrow].join(" ")}>
        {eyebrow}
      </span>
      <h2 className={["font-display text-4xl leading-tight sm:text-5xl", s.heading].join(" ")}>
        {title}
        {accent ? (
          <span className="text-[var(--rellax-sage)]"> {accent}</span>
        ) : null}
      </h2>
      <p className={["mt-5 text-base leading-8", s.description].join(" ")}>
        {description}
      </p>
    </div>
  );
}
