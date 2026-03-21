import type { Metadata } from "next";
import Script from "next/script";

import { ConvexClientProvider } from "@/components/convex-client-provider";
import { SplashProvider } from "@/components/splash";

import "./globals.css";

export const metadata: Metadata = {
  title: "Rellax — Adaptive Onboarding for Modern Teams",
  description:
    "AI-driven onboarding that maps every hire's real capabilities to a personalised training path — so they reach full competency in days, not months.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">{`(function(){try{var t=localStorage.getItem('rellax-theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`}</Script>
      </head>
      <body className="min-h-full flex flex-col">
        <SplashProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </SplashProvider>
      </body>
    </html>
  );
}
