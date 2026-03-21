import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

export default authkitMiddleware({
  middlewareAuth: {
    enabled: true,

    // Routes that DO NOT require login
    unauthenticatedPaths: [
      "/",                 // landing page
      "/about",
      "/auth/social",
      "/blog",
      "/careers",
      "/contact",
      "/cookies",
      "/privacy",
      "/security",
      "/terms",

      // auth routes
      "/login",
      "/signup",
      "/sign-in",
      "/sign-up",
      "/verify-email",
      "/callback",

      // temporary: allow dashboard/onboarding during dev if needed
      // remove later if you want strict auth
      "/dashboard",
      "/onboarding",
      "/employee/dashboard",
      "/employee/change-password",
    ],
  },
});

export const config = {
  matcher: [
    /*
     * Skip Next.js internals and common static asset files so CSS/JS requests
     * are never intercepted by auth middleware.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
};
