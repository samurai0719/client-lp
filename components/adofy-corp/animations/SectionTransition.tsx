"use client";

import type { ReactNode } from "react";
import gsap from "gsap";
import { useGsapContext } from "@/components/adofy-corp/hooks/useGsapContext";
import { useReducedMotion } from "@/components/adofy-corp/hooks/useReducedMotion";

type SectionTransitionProps = {
  children: ReactNode;
  className?: string;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  start?: string;
  end?: string;
};

/**
 * Scrubs a tween directly to scroll position (not "play once") — used for
 * the connective tissue between sections: a grid fading in, a wave easing
 * up, a number brightening as the next section is approached.
 */
export default function SectionTransition({
  children,
  className = "",
  from = { opacity: 0 },
  to = { opacity: 1 },
  start = "top bottom",
  end = "top 60%",
}: SectionTransitionProps) {
  const reducedMotion = useReducedMotion();

  const scope = useGsapContext<HTMLDivElement>(
    ({ scope }) => {
      const el = scope.current;
      if (!el) return;

      if (reducedMotion) {
        gsap.set(el, to);
        return;
      }

      gsap.set(el, from);
      gsap.to(el, {
        ...to,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start,
          end,
          scrub: true,
        },
      });
    },
    [reducedMotion, start, end]
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
