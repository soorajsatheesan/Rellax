import { WorkOS } from "@workos-inc/node";
import { NextResponse } from "next/server";

const workos = new WorkOS(process.env.WORKOS_API_KEY!);

const ALLOWED_PROVIDERS = new Set(["GoogleOAuth", "MicrosoftOAuth"]);
const ALLOWED_MODES = new Set(["sign-up", "sign-in"]);

function encodeReturnPathname(returnPathname: string) {
  return Buffer.from(JSON.stringify({ returnPathname })).toString("base64url");
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const provider = searchParams.get("provider");
  const mode = searchParams.get("mode");

  if (!provider || !ALLOWED_PROVIDERS.has(provider)) {
    return NextResponse.redirect(new URL("/signup?error=auth-provider", request.url));
  }

  if (!mode || !ALLOWED_MODES.has(mode)) {
    return NextResponse.redirect(new URL("/signup?error=auth-mode", request.url));
  }

  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    clientId: process.env.WORKOS_CLIENT_ID!,
    provider,
    redirectUri: process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI!,
    state: encodeReturnPathname(
      mode === "sign-up" ? "/onboarding" : "/dashboard",
    ),
    providerQueryParams: {
      prompt: "select_account",
    },
  });

  return NextResponse.redirect(authorizationUrl || origin);
}
