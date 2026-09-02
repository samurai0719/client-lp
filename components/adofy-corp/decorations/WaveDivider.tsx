import { decoStyle } from "./decoStyle";

type WaveDividerProps = {
  className?: string;
  color?: string;
  opacity?: number;
  flip?: boolean;
};

/**
 * Full-bleed wave used to stitch two sections together.
 * Place absolutely at the bottom of a section (or top, with `flip`).
 */
export default function WaveDivider({
  className = "",
  color = "currentColor",
  opacity = 1,
  flip = false,
}: WaveDividerProps) {
  return (
    <svg
      viewBox="0 0 1440 110"
      className={`pointer-events-none w-full ${flip ? "rotate-180" : ""} ${className}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      style={decoStyle(color, opacity)}
    >
      <path
        d="M0,32 C180,90 360,0 540,28 C720,56 900,96 1080,64 C1260,32 1350,52 1440,40 L1440,110 L0,110 Z"
        fill="currentColor"
      />
    </svg>
  );
}
