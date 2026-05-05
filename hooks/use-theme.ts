"use client";

import { useMemo } from "react";
import { themeToCSSVariables, DEFAULT_THEME } from "@/lib/theme-tokens";
import type { ThemeData } from "@/lib/types";

export function useTheme(theme: ThemeData | undefined) {
  const cssVariables = useMemo(() => {
    if (!theme) return themeToCSSVariables(DEFAULT_THEME);
    return themeToCSSVariables(theme);
  }, [theme]);

  const resolvedTheme = theme || DEFAULT_THEME;

  return {
    theme: resolvedTheme,
    cssVariables,
    isDefault: !theme,
  };
}
