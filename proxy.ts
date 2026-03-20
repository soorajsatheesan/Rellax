import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

const isAuthConfigured =
  process.env.AUTHKIT_REDIRECT_URI ||
  process.env.AUTH_REDIRECT_URI ||
  process.env.WORKOS_CLIENT_ID;

export default isAuthConfigured
  ? authkitMiddleware({
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
          "/verify-email",
          "/sign-in",
          "/sign-up",
          "/callback",
          "/dashboard",
          "/onboarding",
        ],
      },
    })
  : function middleware() {
      // Auth disabled if env not present (local/dev safety)
      return;
    };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};