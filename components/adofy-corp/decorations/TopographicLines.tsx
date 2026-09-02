import { decoStyle } from "./decoStyle";

type TopographicLinesProps = {
  className?: string;
  color?: string;
  opacity?: number;
};

/** Nested contour-map style curves, like elevation lines on a topographic map. */
export default function TopographicLines({
  className = "",
  color = "currentColor",
  opacity = 0.1,
}: TopographicLinesProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={`pointer-events-none ${className}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      style={decoStyle(color, opacity)}
    >
      <g fill="none" stroke="currentColor" strokeWidth={1} vectorEffect="non-scaling-stroke">
        <path d="M40,200 C40,100 140,30 220,40 C310,52 370,130 360,210 C350,300 260,360 170,350 C90,342 40,290 40,200 Z" />
        <path d="M70,205 C70,125 155,68 222,78 C300,90 345,150 338,212 C330,285 258,332 182,324 C115,317 70,275 70,205 Z" />
        <path d="M100,208 C100,148 168,104 224,114 C288,126 322,170 316,214 C310,270 254,304 196,298 C140,292 100,258 100,208 Z" />
        <path d="M130,210 C130,168 180,138 226,148 C272,158 298,188 294,216 C290,254 248,278 208,272 C166,266 130,240 130,210 Z" />
      </g>
    </svg>
  );
}
