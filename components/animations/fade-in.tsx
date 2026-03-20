"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

const TRANSLATE_DISTANCE = "26px";

const INITIAL_TRANSFORMS: Record<Direction, string> = {
  up: `translateY(${TRANSLATE_DISTANCE})`,
  down: `translateY(-${TRANSLATE_DISTANCE})`,
  left: `translateX(${TRANSLATE_DISTANCE})`,
  right: `translateX(-${TRANSLATE_DISTANCE})`,
  none: "none",
};

type Direction = "up" | "down" | "left" | "right" | "none";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: Direction;
  threshold?: number;
};

function prefersReducedMotion() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 600,
  direction = "up",
  threshold = 0.12,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(prefersReducedMotion);

  useEffect(() => {
    const el = ref.current;

    if (!el || isRevealed || prefersReducedMotion()) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isRevealed, threshold]);

  const style: CSSProperties = {
    opacity: isRevealed ? 1 : 0,
    transform: isRevealed ? "none" : INITIAL_TRANSFORMS[direction],
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms,
                 transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
