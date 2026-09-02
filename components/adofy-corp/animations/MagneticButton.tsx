"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/components/adofy-corp/hooks/useReducedMotion";

type MagneticButtonProps = {
  children: ReactNode;
  className?: string;
  /** Max travel distance in px. */
  strength?: number;
};

/**
 * Wraps a CTA so it drifts a few px toward the cursor on desktop pointers
 * only. Touch devices and `prefers-reduced-motion` get the plain button —
 * no listeners are even attached.
 */
export default function MagneticButton({
  children,
  className = "",
  strength = 8,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const quickX = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const quickY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

    const handleMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      quickX(gsap.utils.clamp(-strength, strength, relX * 0.25));
      quickY(gsap.utils.clamp(-strength, strength, relY * 0.25));
    };

    const handleLeave = () => {
      quickX(0);
      quickY(0);
    };

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);

    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [reducedMotion, strength]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
