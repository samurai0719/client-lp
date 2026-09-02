"use client";

import { useId } from "react";
import gsap from "gsap";
import { useGsapContext } from "@/components/adofy-corp/hooks/useGsapContext";
import { useReducedMotion } from "@/components/adofy-corp/hooks/useReducedMotion";

type CircuitNetworkProps = {
  className?: string;
};

// Two fixed right-angled traces — deterministic waypoints, no Math.random().
const TRACE_A = [
  { x: 40, y: 90 },
  { x: 40, y: 40 },
  { x: 220, y: 40 },
  { x: 220, y: 130 },
  { x: 420, y: 130 },
];

const TRACE_B = [
  { x: 760, y: 380 },
  { x: 760, y: 300 },
  { x: 560, y: 300 },
  { x: 560, y: 210 },
  { x: 340, y: 210 },
];

function toPath(points: { x: number; y: number }[]) {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
}

/**
 * SERVICE section background: a faint grid plus two orthogonal "circuit"
 * traces with junction nodes, each carrying one slow light pulse. Reads as
 * "these services are wired together" without pretending to dynamically
 * route between the actual card positions.
 */
export default function CircuitNetwork({ className = "" }: CircuitNetworkProps) {
  const uid = useId().replace(/:/g, "");
  const gridId = `circuit-grid-${uid}`;
  const reducedMotion = useReducedMotion();

  const scope = useGsapContext<HTMLDivElement>(
    ({ scope }) => {
      const el = scope.current;
      if (!el) return;

      const traces = Array.from(el.querySelectorAll<SVGPathElement>("[data-trace]"));
      const pulseA = el.querySelector<SVGCircleElement>("[data-pulse-a]");
      const pulseB = el.querySelector<SVGCircleElement>("[data-pulse-b]");

      if (reducedMotion) {
        traces.forEach((trace) => {
          trace.style.strokeDashoffset = "0";
        });
        return;
      }

      traces.forEach((trace) => {
        const length = trace.getTotalLength();
        trace.style.strokeDasharray = `${length}`;
        trace.style.strokeDashoffset = `${length}`;
      });

      gsap.to(traces, {
        strokeDashoffset: 0,
        duration: 1.4,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        onComplete: () => {
          [
            { el: pulseA, points: TRACE_A },
            { el: pulseB, points: TRACE_B },
          ].forEach(({ el: dot, points }) => {
            if (!dot) return;
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
            points.forEach((point) => {
              tl.to(dot, { attr: { cx: point.x, cy: point.y }, duration: 1.1, ease: "sine.inOut" });
            });
          });
        },
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
        viewBox="0 0 800 420"
        preserveAspectRatio="none"
        focusable="false"
        className="h-full w-full text-accent-blue"
      >
        <defs>
          <pattern id={gridId} width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M48 0 L0 0 0 48"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${gridId})`} opacity="0.06" />

        <g fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.22" vectorEffect="non-scaling-stroke">
          <path data-trace d={toPath(TRACE_A)} />
          <path data-trace d={toPath(TRACE_B)} />
        </g>

        <g fill="currentColor" opacity="0.3">
          {[...TRACE_A, ...TRACE_B].map((point, index) => (
            <circle key={index} cx={point.x} cy={point.y} r="2.5" />
          ))}
        </g>

        <circle data-pulse-a cx={TRACE_A[0].x} cy={TRACE_A[0].y} r="3" fill="#75d7ee" opacity="0.8" />
        <circle data-pulse-b cx={TRACE_B[0].x} cy={TRACE_B[0].y} r="3" fill="#eba445" opacity="0.8" />
      </svg>
    </div>
  );
}
