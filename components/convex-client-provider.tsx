"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { ConvexProviderWithAuthKit } from "@convex-dev/workos";
import {
  AuthKitProvider,
  useAccessToken,
  useAuth,
} from "@workos-inc/authkit-nextjs/components";
import { ConvexReactClient } from "convex/react";

function useWorkOsAuth() {
  const { user, loading } = useAuth();
  const { getAccessToken } = useAccessToken();

  return {
    isLoading: loading,
    user,
    getAccessToken: async () => (await getAccessToken()) ?? null,
  };
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [convex] = useState(
    () => new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!),
  );

  return (
    <AuthKitProvider>
      <ConvexProviderWithAuthKit client={convex} useAuth={useWorkOsAuth}>
        {children}
      </ConvexProviderWithAuthKit>
    </AuthKitProvider>
  );
}
