import type { ReactNode } from "react";
import Link from "next/link";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const VARIANT_STYLES = {
  primary:
    "bg-[var(--rellax-ink)] text-white shadow-[0_10px_30px_rgba(8,8,9,0.16)] hover:-translate-y-0.5",
  secondary:
    "border border-[var(--rellax-line)] bg-white text-[var(--rellax-ink)] hover:-translate-y-0.5 hover:bg-[var(--rellax-surface)]",
  ghost:
    "text-[var(--rellax-ink-soft)] hover:bg-[var(--rellax-surface)] hover:text-[var(--rellax-ink)]",
} as const;

export function Button({
  href,
  children,
  variant = "primary",
  className,
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition",
        VARIANT_STYLES[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Link>
  );
}
