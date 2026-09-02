"use client";

import gsap from "gsap";
import { useGsapContext } from "@/components/adofy-corp/hooks/useGsapContext";
import { useReducedMotion } from "@/components/adofy-corp/hooks/useReducedMotion";

type FooterHorizonProps = {
  className?: string;
};

/** Footer background: one drawn line across the top edge, two distant horizon curves that drift, a quiet semicircle near the logo. */
export default function FooterHorizon({ className = "" }: FooterHorizonProps) {
  const reducedMotion = useReducedMotion();

  const scope = useGsapContext<HTMLDivElement>(
    ({ scope }) => {
      const el = scope.current;
      if (!el) return;

      const topLine = el.querySelector<SVGPathElement>("[data-top-line]");
      const horizons = Array.from(el.querySelectorAll<SVGPathElement>("[data-horizon]"));

      if (reducedMotion) {
        if (topLine) topLine.style.strokeDashoffset = "0";
        return;
      }

      if (topLine) {
        const length = topLine.getTotalLength();
        topLine.style.strokeDasharray = `${length}`;
        topLine.style.strokeDashoffset = `${length}`;
        gsap.to(topLine, {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
        });
      }

      gsap.to(horizons, {
        x: 16,
        duration: 80,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 6,
      });
    },
    [reducedMotion]
  );

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <svg viewBox="0 0 1440 220" preserveAspectRatio="none" focusable="false" className="h-full w-full text-accent-blue">
        <path
          data-top-line
          d="M0,8 C240,28 480,0 720,14 C960,28 1200,4 1440,16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          opacity="0.16"
          vectorEffect="non-scaling-stroke"
        />

        <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.07" vectorEffect="non-scaling-stroke">
          <path data-horizon d="M-100,120 C300,90 700,150 1100,110 C1300,90 1450,120 1540,100" />
          <path data-horizon d="M-100,170 C320,200 760,140 1180,180 C1340,196 1450,170 1540,190" />
        </g>

        <circle cx="64" cy="36" r="30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.08" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
