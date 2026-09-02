"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { decoStyle } from "./decoStyle";

type HandDrawnUnderlineProps = {
  className?: string;
  color?: string;
  width?: number;
};

/** Wobbly, hand-drawn underline that draws itself in once when it scrolls into view. */
export default function HandDrawnUnderline({
  className = "",
  color = "currentColor",
  width = 160,
}: HandDrawnUnderlineProps) {
  const uid = useId();
  const prefersReducedMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 160 14"
      width={width}
      height={(width / 160) * 14}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
      focusable="false"
      style={decoStyle(color)}
    >
      <motion.path
        key={uid}
        d="M2 9.5C26 4 54 3 80 6.5C108 10 132 4 158 7"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
    </svg>
  );
}
