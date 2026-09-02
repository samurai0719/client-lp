"use client";

import gsap from "gsap";
import { useGsapContext } from "@/components/adofy-corp/hooks/useGsapContext";
import { useReducedMotion } from "@/components/adofy-corp/hooks/useReducedMotion";

type MascotFigureProps = {
  src: string;
  alt: string;
  className?: string;
  /**
   * Static transform classes (e.g. a horizontal flip) that must NOT live on
   * the animated `<img>` itself — GSAP decomposes the existing computed
   * transform when it first sets `scale`, and a negative `scaleX` combined
   * with a rotation gets re-decomposed in a way that can flip the art
   * upside down. Put flips/static rotation here; GSAP only ever touches a
   * wrapper-free element.
   */
  wrapperClassName?: string;
  trigger?: "mount" | "scroll";
  delay?: number;
};

/** A brand mascot illustration that pops in once — a friendly accent, never a loop. */
export default function MascotFigure({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  trigger = "scroll",
  delay = 0,
}: MascotFigureProps) {
  const reducedMotion = useReducedMotion();

  const scope = useGsapContext<HTMLImageElement>(
    ({ scope }) => {
      const el = scope.current;
      if (!el) return;

      if (reducedMotion) {
        gsap.set(el, { opacity: 1, scale: 1, y: 0 });
        return;
      }

      gsap.set(el, { opacity: 0, scale: 0.7, y: 24 });
      gsap.to(el, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.9,
        delay,
        ease: "back.out(1.6)",
        ...(trigger === "scroll"
          ? {
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            }
          : {}),
      });
    },
    [reducedMotion, trigger, delay]
  );

  return (
    <span className={`inline-block ${wrapperClassName}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={scope} src={src} alt={alt} className={`pointer-events-none block select-none ${className}`} />
    </span>
  );
}
