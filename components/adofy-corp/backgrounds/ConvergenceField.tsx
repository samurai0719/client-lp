"use client";

import gsap from "gsap";
import { useGsapContext } from "@/components/adofy-corp/hooks/useGsapContext";
import { useReducedMotion } from "@/components/adofy-corp/hooks/useReducedMotion";

type ConvergenceFieldProps = {
  className?: string;
};

const CONVERGENCE = { x: 380, y: 260 };
const EDGE_STARTS = [
  { x: 0, y: 40 },
  { x: 760, y: 30 },
  { x: 0, y: 460 },
  { x: 760, y: 470 },
];

/**
 * Final CTA background: a handful of curves drawing the eye in toward the
 * button, one large slow-turning ring behind it, and two static ripple
 * rings. No continuous scaling — only the ring's rotation and the
 * gradient (driven by CSS) ever move on their own.
 */
export default function ConvergenceField({ className = "" }: ConvergenceFieldProps) {
  const reducedMotion = useReducedMotion();

  const scope = useGsapContext<HTMLDivElement>(
    ({ scope }) => {
      const el = scope.current;
      if (!el) return;

      const lines = Array.from(el.querySelectorAll<SVGPathElement>("[data-converge]"));
      const ring = el.querySelector<SVGGElement>("[data-cta-ring]");

      if (reducedMotion) {
        lines.forEach((line) => {
          line.style.strokeDashoffset = "0";
        });
        return;
      }

      lines.forEach((line) => {
        const length = line.getTotalLength();
        line.style.strokeDasharray = `${length}`;
        line.style.strokeDashoffset = `${length}`;
      });

      gsap.to(lines, {
        strokeDashoffset: 0,
        duration: 1.5,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 75%", toggleActions: "play none none none" },
      });

      if (ring) {
        gsap.to(ring, {
          rotation: 360,
          duration: 70,
          ease: "none",
          repeat: -1,
          transformOrigin: `${CONVERGENCE.x}px ${CONVERGENCE.y}px`,
        });
      }

      gsap.matchMedia().add("(pointer: fine)", () => {
        const glow = el.querySelector<HTMLDivElement>("[data-cta-glow]");
        if (!glow) return;
        const quickX = gsap.quickTo(glow, "x", { duration: 0.6, ease: "power2.out" });
        const quickY = gsap.quickTo(glow, "y", { duration: 0.6, ease: "power2.out" });

        const handleMove = (event: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          quickX(gsap.utils.clamp(-10, 10, (event.clientX - rect.left - rect.width / 2) * 0.02));
          quickY(gsap.utils.clamp(-10, 10, (event.clientY - rect.top - rect.height / 2) * 0.02));
        };

        el.addEventListener("pointermove", handleMove);
        return () => el.removeEventListener("pointermove", handleMove);
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
      <div
        data-cta-glow
        className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(115,162,255,0.35), transparent 70%)" }}
      />
      <svg viewBox="0 0 760 520" focusable="false" className="h-full w-full text-accent-blue">
        <g data-cta-ring fill="none" stroke="currentColor" strokeWidth="1" opacity="0.12" vectorEffect="non-scaling-stroke">
          <ellipse cx={CONVERGENCE.x} cy={CONVERGENCE.y} rx="190" ry="130" />
        </g>

        <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.1" vectorEffect="non-scaling-stroke">
          <circle cx={CONVERGENCE.x} cy={CONVERGENCE.y} r="220" />
          <circle cx={CONVERGENCE.x} cy={CONVERGENCE.y} r="250" />
        </g>

        <g fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.16" vectorEffect="non-scaling-stroke">
          {EDGE_STARTS.map((start, index) => (
            <path
              key={index}
              data-converge
              d={`M${start.x},${start.y} Q${(start.x + CONVERGENCE.x) / 2},${start.y > CONVERGENCE.y ? CONVERGENCE.y + 60 : CONVERGENCE.y - 60} ${CONVERGENCE.x},${CONVERGENCE.y}`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
