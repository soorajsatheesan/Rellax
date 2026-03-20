"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <circle cx="7.5" cy="7.5" r="2.5" fill="currentColor" />
      <path
        d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M3.04 3.04l1.06 1.06M10.9 10.9l1.06 1.06M3.04 11.96l1.06-1.06M10.9 4.1l1.06-1.06"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path
        d="M12.5 9.5A6 6 0 0 1 5.5 2.5a6 6 0 1 0 7 7z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("rellax-theme") as Theme | null;
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This is a simple "wait for client mount" guard to avoid hydration/layout shifts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("rellax-theme", next);
  }

  // Render a placeholder with same dimensions to avoid layout shift
  if (!mounted) {
    return (
      <div
        style={{
          width: "2rem",
          height: "2rem",
          borderRadius: "50%",
          flexShrink: 0,
        }}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "2rem",
        height: "2rem",
        borderRadius: "50%",
        border: "1px solid var(--db-border)",
        background: "var(--db-surface)",
        color: "var(--db-text-soft)",
        cursor: "pointer",
        transition: "background 0.15s, color 0.15s, border-color 0.15s",
        flexShrink: 0,
      }}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
