import { withAuth } from "@workos-inc/authkit-nextjs";
import { NextResponse } from "next/server";

/**
 * Temporary debug route — DELETE after diagnosing auth issue.
 * Visit /api/debug-token while logged in to inspect JWT claims.
 */
export async function GET() {
  const auth = await withAuth();

  if (!auth.accessToken) {
    return NextResponse.json(
      { error: "Not authenticated — log in first." },
      { status: 401 },
    );
  }

  const parts = auth.accessToken.split(".");

  if (parts.length !== 3) {
    return NextResponse.json({ error: "Token is not a JWT." }, { status: 400 });
  }

  const payload = JSON.parse(
    Buffer.from(parts[1], "base64url").toString("utf-8"),
  );

  const clientId = process.env.WORKOS_CLIENT_ID;

  const audArray = Array.isArray(payload.aud)
    ? payload.aud
    : payload.aud
      ? [payload.aud]
      : [];

  const issMatch = payload.iss === "https://api.workos.com";
  const audMatch = audArray.includes(clientId);

  console.log("DEBUG TOKEN iss:", payload.iss);
  console.log("DEBUG TOKEN aud:", payload.aud);
  console.log("DEBUG TOKEN sub:", payload.sub);
  console.log("DEBUG TOKEN issMatch:", issMatch);
  console.log("DEBUG TOKEN audMatch:", audMatch);

  return NextResponse.json({
    token_claims: {
      iss: payload.iss,
      aud: payload.aud,
      sub: payload.sub,
      exp: payload.exp,
      iat: payload.iat,
      // dump remaining claims for full visibility
      ...payload,
    },
    convex_config: {
      domain: "https://api.workos.com",
      applicationID: clientId,
    },
    match: {
      issuer_ok: issMatch,
      audience_ok: audMatch,
      aud_type: Array.isArray(payload.aud) ? "array" : typeof payload.aud,
    },
  });
}
