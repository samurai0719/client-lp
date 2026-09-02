"use client";

import gsap from "gsap";
import { useGsapContext } from "@/components/adofy-corp/hooks/useGsapContext";
import { useReducedMotion } from "@/components/adofy-corp/hooks/useReducedMotion";

type OrbitMetricsProps = {
  className?: string;
  /** Number of strength items — drives how many gauge ticks light up. */
  itemCount?: number;
};

const CENTER = { x: 170, y: 260 };
const RADII = [70, 110, 150];
// Gauge sweeps a quarter circle; tick angles are evenly spaced and fixed.
const TICK_ANGLES_DEG = [-200, -160, -120, -80, -40];

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/**
 * STRENGTH section background: concentric "precision" rings plus a short
 * gauge of tick marks. Ring rotation and tick brightening are both driven
 * by scroll progress — there is no free-running loop tying numbers to
 * nothing.
 */
export default function OrbitMetrics({ className = "", itemCount = 3 }: OrbitMetricsProps) {
  const reducedMotion = useReducedMotion();

  const scope = useGsapContext<HTMLDivElement>(
    ({ scope }) => {
      const el = scope.current;
      if (!el) return;

      const rings = el.querySelector<SVGGElement>("[data-rings]");
      const arc = el.querySelector<SVGPathElement>("[data-arc]");
      const ticks = Array.from(el.querySelectorAll<SVGLineElement>("[data-tick]"));

      if (reducedMotion) {
        if (arc) arc.style.strokeDashoffset = "0";
        return;
      }

      if (arc) {
        const length = arc.getTotalLength();
        arc.style.strokeDasharray = `${length}`;
        arc.style.strokeDashoffset = `${length}`;
        gsap.to(arc, {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 75%", toggleActions: "play none none none" },
        });
      }

      if (rings) {
        gsap.to(rings, {
          rotation: 22,
          transformOrigin: `${CENTER.x}px ${CENTER.y}px`,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      }

      ticks.forEach((tick, index) => {
        const item = document.querySelector(`[data-strength-item="${index}"]`);
        if (!item) return;

        gsap.to(tick, {
          opacity: 0.55,
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
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
      <svg viewBox="0 0 340 480" focusable="false" className="h-full w-full text-accent-blue">
        <g data-rings stroke="currentColor" strokeWidth="1" fill="none" opacity="0.1" vectorEffect="non-scaling-stroke">
          {RADII.map((r) => (
            <circle key={r} cx={CENTER.x} cy={CENTER.y} r={r} />
          ))}
        </g>

        <path
          data-arc
          d={`M ${polar(CENTER.x, CENTER.y, 150, -200).x} ${polar(CENTER.x, CENTER.y, 150, -200).y} A 150 150 0 0 1 ${
            polar(CENTER.x, CENTER.y, 150, -40).x
          } ${polar(CENTER.x, CENTER.y, 150, -40).y}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          opacity="0.16"
          vectorEffect="non-scaling-stroke"
        />

        {TICK_ANGLES_DEG.map((deg, index) => {
          const inner = polar(CENTER.x, CENTER.y, 144, deg);
          const outer = polar(CENTER.x, CENTER.y, 158, deg);
          return (
            <line
              key={deg}
              data-tick={index < itemCount ? "" : undefined}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke={index < itemCount ? "#eba445" : "currentColor"}
              strokeWidth="2"
              opacity={index < itemCount ? 0.18 : 0.12}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
    </div>
  );
}
