"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useMemo, useSyncExternalStore } from "react";

const LOCALE_KEY = "preferred-locale";

// Subscribe to locale changes (localStorage + custom event)
function subscribeToLocale(callback: () => void): () => void {
  window.addEventListener("locale-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("locale-change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getLocaleSnapshot(): string {
  return localStorage.getItem(LOCALE_KEY) ?? "en";
}

function getServerLocaleSnapshot(): string {
  return "en";
}

// Hook to safely read locale using useSyncExternalStore (SSR-safe, no cascading renders)
function useStoredLocale(): string {
  return useSyncExternalStore(subscribeToLocale, getLocaleSnapshot, getServerLocaleSnapshot);
}

// Get single content item
export function useContentKey<T extends string>(
  key: T,
  locale?: string
): string {
  const userLocale = useStoredLocale();
  const activeLocale = locale ?? userLocale;
  const content = useQuery(api.content.get, { key, locale: activeLocale });

  return content ?? key;
}

// Get multiple content items
export function useContent<T extends Record<string, string>>(
  keys: (keyof T)[],
  locale?: string
): T | null {
  const userLocale = useStoredLocale();
  const activeLocale = locale ?? userLocale;
  const data = useQuery(api.content.getBulk, {
    keys: keys as string[],
    locale: activeLocale,
  });

  return useMemo(() => {
    if (!data) return null;
    return keys.reduce((acc, key) => ({
      ...acc,
      [key]: data[key as string] ?? (key as string),
    }), {} as T);
  }, [data, keys]);
}

// Set locale helper
export function setContentLocale(locale: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCALE_KEY, locale);
    // Trigger re-render by dispatching custom event
    window.dispatchEvent(new CustomEvent("locale-change", { detail: locale }));
  }
}

// Get current locale
export function getContentLocale(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem(LOCALE_KEY) ?? "en";
  }
  return "en";
}