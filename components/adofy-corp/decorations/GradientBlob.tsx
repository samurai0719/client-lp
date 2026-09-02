import { useId } from "react";

type GradientBlobProps = {
  className?: string;
  from?: string;
  to?: string;
  opacity?: number;
  floating?: boolean;
};

/** Soft, organic blob filled with a two-tone gradient. CSS blur keeps it cheap. */
export default function GradientBlob({
  className = "",
  from = "#60a5fa",
  to = "#f59e0b",
  opacity = 0.2,
  floating = true,
}: GradientBlobProps) {
  const uid = useId();
  const gradientId = `blob-${uid}`;

  return (
    <svg
      viewBox="0 0 400 400"
      className={`pointer-events-none blur-2xl ${floating ? "deco-float" : ""} ${className}`}
      aria-hidden="true"
      focusable="false"
      style={{ opacity }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${gradientId})`}
        d="M112,38 C176,8 268,18 320,72 C372,126 378,222 332,284 C286,346 188,372 122,338 C56,304 18,222 30,150 C42,78 48,68 112,38 Z"
      />
    </svg>
  );
}
