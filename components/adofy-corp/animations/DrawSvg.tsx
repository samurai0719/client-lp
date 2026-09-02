"use client";

import type { ReactNode } from "react";
import gsap from "gsap";
import { useGsapContext } from "@/components/adofy-corp/hooks/useGsapContext";
import { useReducedMotion } from "@/components/adofy-corp/hooks/useReducedMotion";

type DrawSvgProps = {
  /** An inline <svg> whose <path>/<line> elements carry a `data-draw` attribute. */
  children: ReactNode;
  className?: string;
  trigger?: "mount" | "scroll";
  duration?: number;
  delay?: number;
  stagger?: number;
};

/** Animates stroke-dashoffset on any `[data-draw]` shape so the line appears to draw itself in. */
export default function DrawSvg({
  children,
  className = "",
  trigger = "scroll",
  duration = 1.1,
  delay = 0,
  stagger = 0.1,
}: DrawSvgProps) {
  const reducedMotion = useReducedMotion();

  const scope = useGsapContext<HTMLDivElement>(
    ({ scope }) => {
      const el = scope.current;
      if (!el) return;
      const shapes = el.querySelectorAll<SVGGeometryElement>("[data-draw]");
      if (!shapes.length) return;

      if (reducedMotion) {
        shapes.forEach((shape) => {
          shape.style.strokeDashoffset = "0";
        });
        return;
      }

      shapes.forEach((shape) => {
        const length = shape.getTotalLength();
        shape.style.strokeDasharray = `${length}`;
        shape.style.strokeDashoffset = `${length}`;
      });

      gsap.to(shapes, {
        strokeDashoffset: 0,
        duration,
        delay,
        stagger,
        ease: "power2.out",
        ...(trigger === "scroll"
          ? {
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          : {}),
      });
    },
    [reducedMotion, trigger, duration, delay, stagger]
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
