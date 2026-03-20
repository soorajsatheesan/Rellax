import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  tone?: "dark" | "light";
  className?: string;
};

export function BrandLogo({
  href = "/",
  tone = "dark",
  className,
}: BrandLogoProps) {
  const textColor =
    tone === "light" ? "text-white" : "text-[var(--rellax-ink)]";

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
        ].join(" ")}
      >
        Rellax
      </span>
    </Link>
  );
}
