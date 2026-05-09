"use client";

import { ReactNode, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { I18nProvider } from "@/i18n/provider";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!convexUrl) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured. Please set it in your environment variables.");
}
const convex = new ConvexReactClient(convexUrl);

function ConvexClerkBridge({ children }: { children: ReactNode }) {
  const clerkAuth = useAuth();

  const convexAuth = useMemo(
    () => ({
      isLoading: !clerkAuth.isLoaded,
      isAuthenticated: clerkAuth.isSignedIn ?? false,
      fetchAccessToken: async ({
        forceRefreshToken,
      }: {
        forceRefreshToken?: boolean;
      }) => {
        if (!clerkAuth.isSignedIn) return null;
        try {
          const token = await clerkAuth.getToken({
            template: "convex",
            skipCache: forceRefreshToken,
          });
          return token ?? null;
        } catch (err) {
          console.error("[Convex Auth] Failed to fetch access token:", err);
          return null;
        }
      },
    }),
    [clerkAuth]
  );

  return (
    <ConvexProviderWithAuth client={convex} useAuth={() => convexAuth}>
      {children}
    </ConvexProviderWithAuth>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexClerkBridge>
      <I18nProvider>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </NextThemesProvider>
      </I18nProvider>
    </ConvexClerkBridge>
  );
}
