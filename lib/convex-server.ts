import { ConvexHttpClient } from "convex/browser";

export function createAuthenticatedConvexClient(accessToken?: string) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!convexUrl) {
    throw new Error("Missing NEXT_PUBLIC_CONVEX_URL.");
  }

  if (!accessToken) {
    throw new Error("Missing access token for Convex request.");
  }

  const convex = new ConvexHttpClient(convexUrl);
  convex.setAuth(accessToken);

  return convex;
}
