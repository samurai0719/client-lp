"use client";

import gsap from "gsap";
import { useGsapContext } from "@/components/adofy-corp/hooks/useGsapContext";
import { useReducedMotion } from "@/components/adofy-corp/hooks/useReducedMotion";

type PerspectiveGridProps = {
  className?: string;
};

const VANISH = { x: 400, y: -60 };
const FLOOR_EDGES = [40, 160, 280, 400, 520, 640, 760];

/**
 * WORKS section background: a one-point perspective grid receding toward a
 * vanishing point above the section, a large faint "browser frame" loosely
 * holding the card area, and a single scan-line sweep on reveal — never a
 * repeating effect.
 */
export default function PerspectiveGrid({ className = "" }: PerspectiveGridProps) {
  const reducedMotion = useReducedMotion();

  const scope = useGsapContext<HTMLDivElement>(
    ({ scope }) => {
      const el = scope.current;
      if (!el) return;

      const lines = Array.from(el.querySelectorAll<SVGLineElement>("[data-grid-line]"));
      const frame = el.querySelector<SVGRectElement>("[data-frame]");
      const scan = el.querySelector<SVGRectElement>("[data-scan]");
      const drawables = [...lines, frame].filter(Boolean) as SVGGeometryElement[];

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

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 75%", toggleActions: "play none none none" },
      });

      tl.to(drawables, { strokeDashoffset: 0, duration: 1.3, stagger: 0.04, ease: "power2.out" });

      if (scan) {
        gsap.set(scan, { opacity: 0.5 });
        tl.fromTo(
          scan,
          { y: 0 },
          { y: 420, duration: 1.1, ease: "power1.inOut" },
          0.3
        ).to(scan, { opacity: 0, duration: 0.3 }, ">-0.1");
      }

      gsap.matchMedia().add("(min-width: 1024px)", () => {
        gsap.to(lines, {
          y: 14,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
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
      <svg
        viewBox="0 0 800 480"
        preserveAspectRatio="none"
        focusable="false"
        className="h-full w-full text-ink"
      >
        <g stroke="currentColor" strokeWidth="1" opacity="0.07" vectorEffect="non-scaling-stroke">
          {FLOOR_EDGES.map((x, index) => (
            <line key={index} data-grid-line x1={VANISH.x} y1={VANISH.y} x2={x} y2="480" />
          ))}
        </g>

        <rect
          data-frame
          x="80"
          y="40"
          width="640"
          height="380"
          rx="28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.08"
          vectorEffect="non-scaling-stroke"
        />
        <line x1="80" y1="78" x2="720" y2="78" stroke="currentColor" strokeWidth="1" opacity="0.08" vectorEffect="non-scaling-stroke" />

        <rect
          data-scan
          x="80"
          y="40"
          width="640"
          height="2"
          fill="#75d7ee"
          opacity="0"
        />
      </svg>
    </div>
  );
}
