"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapContext } from "@/components/adofy-corp/hooks/useGsapContext";
import { useReducedMotion } from "@/components/adofy-corp/hooks/useReducedMotion";

type ScrollProgressBarProps = {
  className?: string;
};

/** Thin brand-blue line at the very top of the viewport that fills with scroll progress. */
export default function ScrollProgressBar({ className = "" }: ScrollProgressBarProps) {
  const reducedMotion = useReducedMotion();

  const scope = useGsapContext<HTMLDivElement>(
    ({ scope }) => {
      const el = scope.current;
      if (!el || reducedMotion) return;

      gsap.set(el, { scaleX: 0 });

      ScrollTrigger.create({
        start: 0,
        end: () => Math.max(document.documentElement.scrollHeight - window.innerHeight, 1),
        onUpdate: (self) => gsap.set(el, { scaleX: self.progress }),
      });
    },
    [reducedMotion]
  );

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 hidden h-[2px] origin-left bg-accent-blue md:block ${className}`}
      ref={scope}
      style={{ transform: "scaleX(0)" }}
    />
  );
}
