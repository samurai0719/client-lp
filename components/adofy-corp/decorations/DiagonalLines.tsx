import { useId } from "react";
import { decoStyle } from "./decoStyle";

type DiagonalLinesProps = {
  className?: string;
  color?: string;
  opacity?: number;
  spacing?: number;
  angle?: number;
};

/** Thin diagonal hatch pattern, e.g. for a corner accent (Stripe-style crossing layers). */
export default function DiagonalLines({
  className = "",
  color = "currentColor",
  opacity = 0.1,
  spacing = 22,
  angle = 35,
}: DiagonalLinesProps) {
  const uid = useId();
  const patternId = `diag-${uid}`;

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
          width={spacing}
          height={spacing}
          patternUnits="userSpaceOnUse"
          patternTransform={`rotate(${angle})`}
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={spacing}
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
