import { useId } from "react";
import { decoStyle } from "./decoStyle";

type LineGridProps = {
  className?: string;
  color?: string;
  opacity?: number;
  cell?: number;
};

/** Thin square grid built from a single repeating SVG <pattern>. */
export default function LineGrid({
  className = "",
  color = "currentColor",
  opacity = 0.08,
  cell = 56,
}: LineGridProps) {
  const uid = useId();
  const patternId = `linegrid-${uid}`;

  return (
    <svg
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
      focusable="false"
      style={decoStyle(color, opacity)}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id={patternId}
          width={cell}
          height={cell}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${cell} 0 L 0 0 0 ${cell}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
