"use client";

import type { ReactNode } from "react";
import gsap from "gsap";
import { useGsapContext } from "@/components/adofy-corp/hooks/useGsapContext";
import { useReducedMotion } from "@/components/adofy-corp/hooks/useReducedMotion";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  y?: number;
  scale?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  start?: string;
};

/** Fades + lifts content in once, the moment it scrolls into view. */
export default function ScrollReveal({
  children,
  className = "",
  y = 28,
  scale = 1,
  duration = 0.7,
  delay = 0,
  ease = "power3.out",
  start = "top 85%",
}: ScrollRevealProps) {
  const reducedMotion = useReducedMotion();

  const scope = useGsapContext<HTMLDivElement>(
    ({ scope }) => {
      const el = scope.current;
      if (!el) return;

      if (reducedMotion) {
        gsap.set(el, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.set(el, { opacity: 0, y, scale });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration,
        delay,
        ease,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
      });
    },
    [reducedMotion, y, scale, duration, delay, ease, start]
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
