import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  tone?: "dark" | "light" | "auto";
  className?: string;
};

export function BrandLogo({
  href = "/",
  tone = "dark",
  className,
}: BrandLogoProps) {
  const textColor =
    tone === "light"
      ? "text-white"
      : tone === "auto"
      ? ""
      : "text-[var(--rellax-ink)]";

  const style = tone === "auto" ? { color: "var(--db-text)" } : undefined;

  return (
    <Link
      href={href}
      aria-label="Rellax home"
      className={["inline-flex items-center", className].filter(Boolean).join(" ")}
    >
      <span
        className={[
          "font-display text-[1.8rem] font-semibold leading-none tracking-[-0.06em]",
          textColor,
        ]
          .filter(Boolean)
          .join(" ")}
        style={style}
      >
        Rellax
      </span>
    </Link>
  );
}
