import { decoStyle } from "./decoStyle";

type OrbitRingsProps = {
  className?: string;
  color?: string;
  accentColor?: string;
  opacity?: number;
  rings?: number;
  animated?: boolean;
};

/**
 * Concentric orbit rings with a small marker travelling one ring, used behind
 * photos, video frames and service cards. Rotation is one slow `<g>` transform,
 * never per-frame JS.
 */
export default function OrbitRings({
  className = "",
  color = "currentColor",
  accentColor,
  opacity = 0.16,
  rings = 3,
  animated = true,
}: OrbitRingsProps) {
  const size = 100;
  const center = size / 2;
  const step = center / (rings + 0.6);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
      focusable="false"
      style={decoStyle(color, opacity)}
    >
      {Array.from({ length: rings }).map((_, index) => (
        <circle
          key={index}
          cx={center}
          cy={center}
          r={step * (index + 1)}
          fill="none"
          stroke="currentColor"
          strokeWidth={0.6}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <g className={animated ? "deco-spin-slow" : ""} style={{ transformBox: "fill-box" }}>
        <circle
          cx={center}
          cy={center - step * rings}
          r={1.6}
          fill={accentColor ?? "currentColor"}
        />
      </g>
    </svg>
  );
}
