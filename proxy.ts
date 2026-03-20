import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

export default authkitMiddleware({
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: [
      "/",
      "/about",
      "/auth/social",
      "/blog",
      "/careers",
      "/contact",
      "/cookies",
      "/privacy",
      "/security",
      "/terms",
      "/login",
      "/signup",
      "/employee/dashboard",
      "/employee/change-password",
      "/verify-email",
      "/sign-in",
      "/sign-up",
      "/callback",
      "/dashboard",
      "/onboarding",
    ],
  },
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
