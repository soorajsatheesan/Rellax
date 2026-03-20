"use client";

import type { ReactNode } from "react";

import { SplashScreen } from "./splash-screen";
import { useSplashTimer } from "./use-splash-timer";

type SplashProviderProps = {
  children: ReactNode;
};

/** Orchestrates splash visibility and mounts/unmounts the overlay. */
export function SplashProvider({ children }: SplashProviderProps) {
  const { isShown, isFading } = useSplashTimer();

  return (
    <>
      {isShown && <SplashScreen isFading={isFading} />}
      {children}
    </>
  );
}
