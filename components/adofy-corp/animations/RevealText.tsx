"use client";

import type { ReactNode } from "react";
import gsap from "gsap";
import { useGsapContext } from "@/components/adofy-corp/hooks/useGsapContext";
import { useReducedMotion } from "@/components/adofy-corp/hooks/useReducedMotion";

type RevealTextProps = {
  /** Each entry renders as one masked line — split by meaning, not by character. */
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  /** "mount" plays immediately (hero); "scroll" waits until it scrolls into view. */
  trigger?: "mount" | "scroll";
};

/** Line-masked heading reveal: each line slides up out of an overflow-hidden band. */
export default function RevealText({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  stagger = 0.12,
  duration = 0.9,
  trigger = "scroll",
}: RevealTextProps) {
  const reducedMotion = useReducedMotion();

  const scope = useGsapContext<HTMLDivElement>(
    ({ scope }) => {
      const el = scope.current;
      if (!el) return;
      const rows = el.querySelectorAll<HTMLElement>("[data-reveal-row]");
      if (!rows.length) return;

      if (reducedMotion) {
        gsap.set(rows, { yPercent: 0, opacity: 1 });
        return;
      }

      gsap.set(rows, { yPercent: 110, opacity: 0 });
      gsap.to(rows, {
        yPercent: 0,
        opacity: 1,
        duration,
        delay,
        stagger,
        ease: "expo.out",
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
    [reducedMotion, trigger, delay, stagger, duration]
  );

  return (
    <span ref={scope} className={`block ${className}`}>
      {lines.map((line, index) => (
        <span key={index} className="block overflow-hidden">
          <span data-reveal-row className={`block ${lineClassName}`}>
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}
