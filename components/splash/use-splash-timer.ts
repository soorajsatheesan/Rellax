"use client";

import { useEffect, useState } from "react";

/** How long the splash stays fully visible before the fade begins. */
const SHOW_DURATION_MS = 1500;

/** Duration of the fade-out transition — must match splash.module.css `transition`. */
const FADE_DURATION_MS = 400;

type SplashTimerState = {
  isShown: boolean;
  isFading: boolean;
};

/** Owns all splash timing logic. Returns display state for the splash overlay. */
export function useSplashTimer(): SplashTimerState {
  const [isShown, setIsShown] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsFading(true), SHOW_DURATION_MS);
    const hideTimer = setTimeout(
      () => setIsShown(false),
      SHOW_DURATION_MS + FADE_DURATION_MS
    );

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return { isShown, isFading };
}
