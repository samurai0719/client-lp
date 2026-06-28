"use client";

import React, { useEffect, useRef, type ReactNode } from "react";

type Variant = "up" | "fade" | "right" | "scale";

type Props = {
  children: ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
};

const VARIANT_CLASS: Record<Variant, string> = {
  up: "tkn-animate-up",
  fade: "tkn-animate-fade",
  right: "tkn-animate-right",
  scale: "tkn-animate-scale",
};

export default function AnimateOnScroll({
  children,
  variant = "up",
  delay = 0,
  className = "",
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      el.classList.add("tkn-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const timeout = setTimeout(() => {
              el.classList.add("tkn-visible");
            }, delay);
            observer.unobserve(el);
            return () => clearTimeout(timeout);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const animClass = VARIANT_CLASS[variant];
  const style = delay > 0 ? { transitionDelay: `${delay}ms` } : undefined;

  const Comp = Tag as React.ElementType;
  return (
    <Comp
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${animClass}${className ? ` ${className}` : ""}`}
      style={style}
    >
      {children}
    </Comp>
  );
}
