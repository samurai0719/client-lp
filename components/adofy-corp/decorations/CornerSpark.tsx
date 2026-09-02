import { decoStyle } from "./decoStyle";

type CornerSparkProps = {
  className?: string;
  color?: string;
  opacity?: number;
  variant?: "spark" | "plus" | "star" | "ring";
  fade?: boolean;
};

/** Small accent mark — a 4-point spark, plus, star, or ring — for corners and CTAs. */
export default function CornerSpark({
  className = "",
  color = "currentColor",
  opacity = 0.4,
  variant = "spark",
  fade = false,
}: CornerSparkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`pointer-events-none ${fade ? "deco-fade" : ""} ${className}`}
      aria-hidden="true"
      focusable="false"
      style={decoStyle(color, opacity)}
    >
      {variant === "spark" && (
        <path
          d="M12 2 L13.4 9.6 L21 11 L13.4 12.4 L12 20 L10.6 12.4 L3 11 L10.6 9.6 Z"
          fill="currentColor"
        />
      )}
      {variant === "plus" && (
        <path
          d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7Z"
          fill="currentColor"
        />
      )}
      {variant === "star" && (
        <path
          d="M12 3 L14.5 9.2 L21 9.8 L16 14.2 L17.5 21 L12 17.3 L6.5 21 L8 14.2 L3 9.8 L9.5 9.2 Z"
          fill="currentColor"
        />
      )}
      {variant === "ring" && (
        <circle
          cx="12"
          cy="12"
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}
