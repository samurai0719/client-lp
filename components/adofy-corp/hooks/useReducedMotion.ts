"use client";

import { useEffect, useState } from "react";

function getInitialReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Tracks `prefers-reduced-motion: reduce`, reactive to live changes. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(getInitialReducedMotion);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (event: MediaQueryListEvent) => setReduced(event.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return reduced;
}
