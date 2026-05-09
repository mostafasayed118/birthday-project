"use client";

import { useEffect, useState } from "react";

const getMediaQueryMatch = (initialValue: boolean) => {
  if (typeof window === "undefined") return initialValue;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => getMediaQueryMatch(false));

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReduced;
}
