import type { ReactNode } from "react";

const PARTICLES = [
  { top: "-26%", left:  "5%", size: 11, dur: "1.5s", delay: "0.0s" },
  { top: "-22%", left: "84%", size:  7, dur: "2.0s", delay: "0.5s" },
  { top:  "94%", left: "12%", size:  9, dur: "1.7s", delay: "0.9s" },
  { top:  "96%", left: "74%", size:  6, dur: "1.9s", delay: "0.3s" },
  { top:  "38%", left: "-9%", size:  8, dur: "2.2s", delay: "1.1s" },
  { top:  "32%", left:"107%", size: 10, dur: "1.6s", delay: "0.7s" },
];

export default function SparklesText({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="sparkle-particle absolute pointer-events-none select-none"
          style={
            {
              top: p.top,
              left: p.left,
              "--dur": p.dur,
              "--delay": p.delay,
            } as React.CSSProperties
          }
          aria-hidden
        >
          <svg width={p.size} height={p.size} viewBox="0 0 12 12" fill="none">
            <path
              d="M6 0L7.06 4.94L12 6L7.06 7.06L6 12L4.94 7.06L0 6L4.94 4.94L6 0Z"
              fill="#f59e0b"
            />
          </svg>
        </span>
      ))}
      <span className="sparkle-text">{children}</span>
    </span>
  );
}
