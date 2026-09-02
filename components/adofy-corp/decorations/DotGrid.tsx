import { useId } from "react";
import { decoStyle } from "./decoStyle";

type DotGridProps = {
  className?: string;
  color?: string;
  opacity?: number;
  spacing?: number;
  dotRadius?: number;
  fade?: boolean;
};

/** Tiled dot pattern. Uses a single SVG <pattern> tile, never per-dot DOM nodes. */
export default function DotGrid({
  className = "",
  color = "currentColor",
  opacity = 0.14,
  spacing = 28,
  dotRadius = 1.4,
  fade = false,
}: DotGridProps) {
  const uid = useId();
  const patternId = `dotgrid-${uid}`;

  return (
    <svg
      className={`pointer-events-none ${fade ? "deco-fade" : ""} ${className}`}
      aria-hidden="true"
      focusable="false"
      style={decoStyle(color, opacity)}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id={patternId}
          width={spacing}
          height={spacing}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={spacing / 2} cy={spacing / 2} r={dotRadius} fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
