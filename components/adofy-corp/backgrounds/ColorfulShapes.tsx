"use client";

import { useId } from "react";
import gsap from "gsap";
import { useGsapContext } from "@/components/adofy-corp/hooks/useGsapContext";
import { useReducedMotion } from "@/components/adofy-corp/hooks/useReducedMotion";

type Shape = {
  type: "circle" | "ring" | "square" | "blob";
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  rotate?: number;
};

type ColorfulShapesProps = {
  className?: string;
  /** Desktop/landscape shape set, laid out against a 1000x600 viewBox. */
  shapes: Shape[];
  /**
   * Portrait-tuned shape set for narrow viewports. If omitted, `shapes` is
   * reused, but a 1000x600 (landscape) viewBox sliced into a tall narrow
   * box crops most of the x-spread out — always supply this for sections
   * where the mobile look matters, laid out against a 500x900 viewBox.
   */
  mobileShapes?: Shape[];
};

const BLOB_PATH =
  "M58,8 C82,2 104,18 108,42 C112,66 96,90 72,96 C48,102 18,92 8,68 C-2,44 8,18 30,10 C40,6 50,10 58,8 Z";

function renderShape(shape: Shape, key: string) {
  if (shape.type === "circle") {
    return (
      <circle key={key} data-shape cx={shape.x} cy={shape.y} r={shape.size / 2} fill={shape.color} opacity={shape.opacity} />
    );
  }
  if (shape.type === "ring") {
    return (
      <circle
        key={key}
        data-shape
        cx={shape.x}
        cy={shape.y}
        r={shape.size / 2}
        fill="none"
        stroke={shape.color}
        strokeWidth={3}
        opacity={shape.opacity}
        vectorEffect="non-scaling-stroke"
      />
    );
  }
  if (shape.type === "square") {
    return (
      <rect
        key={key}
        data-shape
        x={shape.x - shape.size / 2}
        y={shape.y - shape.size / 2}
        width={shape.size}
        height={shape.size}
        rx={shape.size * 0.22}
        fill={shape.color}
        opacity={shape.opacity}
        transform={shape.rotate ? `rotate(${shape.rotate} ${shape.x} ${shape.y})` : undefined}
      />
    );
  }
  // blob
  const scale = shape.size / 110;
  return (
    <g key={key} data-shape transform={`translate(${shape.x - 55 * scale}, ${shape.y - 50 * scale}) scale(${scale})`}>
      <path d={BLOB_PATH} fill={shape.color} opacity={shape.opacity} />
    </g>
  );
}

/**
 * A handful of brand-colored circles / rings / rounded squares scattered
 * behind a section — purely decorative accent shapes (not a grid, not a
 * line pattern). Each drifts a few px on its own slow, independent loop.
 * Deterministic positions only (no Math.random()), so SSR/CSR markup matches.
 *
 * Renders two independent SVGs (one per breakpoint) rather than reusing a
 * single landscape viewBox sliced into a portrait box — `preserveAspectRatio
 *="slice"` crops a different axis depending on container aspect ratio, so a
 * desktop-tuned layout goes mostly invisible once squeezed into a narrow
 * mobile width.
 */
export default function ColorfulShapes({ className = "", shapes, mobileShapes }: ColorfulShapesProps) {
  const uid = useId().replace(/:/g, "");
  const reducedMotion = useReducedMotion();

  const scope = useGsapContext<HTMLDivElement>(
    ({ scope }) => {
      const el = scope.current;
      if (!el || reducedMotion) return;

      const nodes = Array.from(el.querySelectorAll<SVGElement>("[data-shape]"));
      nodes.forEach((node, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        gsap.to(node, {
          y: 14 * dir,
          x: 8 * dir,
          duration: 10 + i * 2.2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
    },
    [reducedMotion, shapes.length, mobileShapes?.length]
  );

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {mobileShapes && (
        <svg
          viewBox="0 0 500 900"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          className="h-full w-full md:hidden"
        >
          {mobileShapes.map((shape, i) => renderShape(shape, `${uid}-m-${i}`))}
        </svg>
      )}
      <svg
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
        className={`h-full w-full ${mobileShapes ? "hidden md:block" : ""}`}
      >
        {shapes.map((shape, i) => renderShape(shape, `${uid}-d-${i}`))}
      </svg>
    </div>
  );
}
