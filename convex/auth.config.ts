const clientId = process.env.WORKOS_CLIENT_ID;

if (!clientId) {
  throw new Error("Missing WORKOS_CLIENT_ID for Convex auth configuration.");
}

// WorkOS issues tokens with different issuers depending on auth flow.
// - iss: "https://api.workos.com" (password, some OAuth)
// - iss: "https://api.workos.com/user_management/${clientId}" (other flows)
const authConfig = {
  providers: [
    {
      type: "customJwt",
      issuer: "https://api.workos.com",
      algorithm: "RS256",
      jwks: `https://api.workos.com/sso/jwks/${clientId}`,
      applicationID: clientId,
    },
    {
      type: "customJwt",
      issuer: `https://api.workos.com/user_management/${clientId}`,
      algorithm: "RS256",
      jwks: `https://api.workos.com/sso/jwks/${clientId}`,
    },
  ],
};

export default authConfig;
