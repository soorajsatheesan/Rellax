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

// Apply middleware to ALL routes
export const config = {
  matcher: ["/:path*"],
};