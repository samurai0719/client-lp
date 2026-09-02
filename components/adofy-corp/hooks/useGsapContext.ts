"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let pluginsRegistered = false;

function ensurePlugins() {
  if (!pluginsRegistered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    pluginsRegistered = true;
  }
}

/**
 * Scopes a gsap.context() to a ref so every tween/ScrollTrigger created
 * inside `build` is automatically reverted on unmount (and on the
 * mount/unmount/mount cycle React Strict Mode runs in dev) — no animation
 * ever survives a re-render or gets registered twice.
 *
 * `build` may itself return a cleanup function (e.g. to remove a raw
 * `addEventListener` it attached) — gsap.context() only tracks gsap/
 * ScrollTrigger instances, not plain DOM listeners, so that cleanup isn't
 * automatic and must run alongside `ctx.revert()`.
 */
export function useGsapContext<T extends Element = HTMLDivElement>(
  build: (args: { scope: RefObject<T | null> }) => (() => void) | void,
  deps: unknown[] = []
): RefObject<T | null> {
  const scope = useRef<T | null>(null);

  useEffect(() => {
    ensurePlugins();
    let extraCleanup: (() => void) | void;
    const ctx = gsap.context(() => {
      extraCleanup = build({ scope });
    }, scope);
    return () => {
      extraCleanup?.();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scope;
}
