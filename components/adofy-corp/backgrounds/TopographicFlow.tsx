"use client";

import { useId } from "react";
import gsap from "gsap";
import { useGsapContext } from "@/components/adofy-corp/hooks/useGsapContext";
import { useReducedMotion } from "@/components/adofy-corp/hooks/useReducedMotion";

type TopographicFlowProps = {
  className?: string;
};

const BASE_CONTOUR =
  "M40,200 C40,100 140,30 220,40 C310,52 370,130 360,210 C350,300 260,360 170,350 C90,342 40,290 40,200 Z";

// Deterministic nested contour scale steps — no Math.random(), same render every time.
const CONTOUR_SCALES = [1, 0.91, 0.82, 0.73, 0.64, 0.55, 0.46, 0.37];

/**
 * ABOUT section background: a topographic-map style field of nested contour
 * lines, one thicker "flow" line running behind the message card, and a
 * single rising curve standing for growth. Lines draw themselves in once,
 * then drift a few px forever — never enough to read as "moving wallpaper".
 */
export default function TopographicFlow({ className = "" }: TopographicFlowProps) {
  const uid = useId().replace(/:/g, "");
  const flowGradientId = `flow-grad-${uid}`;
  const reducedMotion = useReducedMotion();

  const scope = useGsapContext<HTMLDivElement>(
    ({ scope }) => {
      const el = scope.current;
      if (!el) return;

      const contours = Array.from(el.querySelectorAll<SVGPathElement>("[data-contour]"));
      const flow = el.querySelector<SVGPathElement>("[data-flow]");
      const growth = el.querySelector<SVGPathElement>("[data-growth]");
      const drawables = [...contours, flow, growth].filter(Boolean) as SVGGeometryElement[];

      if (reducedMotion) {
        drawables.forEach((shape) => {
          shape.style.strokeDashoffset = "0";
        });
        return;
      }

      drawables.forEach((shape) => {
        const length = shape.getTotalLength();
        shape.style.strokeDasharray = `${length}`;
        shape.style.strokeDashoffset = `${length}`;
      });

      gsap.to(drawables, {
        strokeDashoffset: 0,
        duration: 1.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      gsap.to(contours, {
        x: 12,
        duration: 42,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
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
      <svg
        viewBox="0 0 760 480"
        preserveAspectRatio="none"
        focusable="false"
        className="h-full w-full text-accent-blue"
      >
        <defs>
          <linearGradient id={flowGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2f6feb" />
            <stop offset="100%" stopColor="#75d7ee" />
          </linearGradient>
        </defs>

        <g
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.1"
          vectorEffect="non-scaling-stroke"
          transform="translate(-40 20)"
        >
          {CONTOUR_SCALES.map((scale, index) => (
            <path
              key={index}
              data-contour
              d={BASE_CONTOUR}
              transform={`translate(200 200) scale(${scale}) translate(-200 -200)`}
            />
          ))}
        </g>

        <path
          data-flow
          d="M0,360 C160,300 280,260 360,250 C480,235 600,180 760,90"
          fill="none"
          stroke={`url(#${flowGradientId})`}
          strokeWidth="2.5"
          opacity="0.16"
          vectorEffect="non-scaling-stroke"
        />

        <path
          data-growth
          d="M20,460 C140,420 220,340 300,300 C400,250 480,160 560,40"
          fill="none"
          stroke="#eba445"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.22"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
