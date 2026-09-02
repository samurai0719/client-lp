"use client";

import { useEffect, useId, useState } from "react";

type MockupScreenProps = {
  className?: string;
  variant?: "analytics" | "lp" | "creative";
  label?: string;
  /** e.g. "/images/about/performance" — .jpg/.png/.webp are tried in turn client-side. */
  imageBase?: string;
  alt?: string;
};

const CANDIDATE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

/**
 * A browser-frame visual. If `src` is given and actually loads, the real
 * photo/screenshot fills the frame. Otherwise (no src, still loading, or a
 * 404) a constructed CSS+inline-SVG placeholder — never a photographic
 * file — fills the same frame so the layout never looks broken.
 */
export default function MockupScreen({
  className = "",
  variant = "analytics",
  label,
  imageBase,
  alt = "",
}: MockupScreenProps) {
  const uid = useId().replace(/:/g, "");
  const barGradientId = `mockup-bar-${uid}`;
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!imageBase) return;
    let cancelled = false;

    (async () => {
      for (const ext of CANDIDATE_EXTENSIONS) {
        const candidate = `${imageBase}.${ext}`;
        const found = await new Promise<boolean>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = candidate;
        });
        if (cancelled) return;
        if (found) {
          setResolvedSrc(candidate);
          return;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [imageBase]);

  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border border-border-soft bg-white shadow-hover ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-border-soft bg-mist-gray/70 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-accent-blue/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-amber/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-blue/30" />
        <span className="ml-2 h-2 w-28 rounded-full bg-ink-soft/10" />
        {label && (
          <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-ink-soft/60">
            {label}
          </span>
        )}
      </div>

      <div className="relative aspect-[16/11] w-full bg-mist-blue">
        {resolvedSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={resolvedSrc} alt={alt} className="h-full w-full object-contain" />
        ) : (
          <div className="h-full w-full p-5">
            {variant === "analytics" && (
              <div className="flex h-full flex-col gap-3">
                <div className="flex gap-2">
                  <div className="h-6 w-20 rounded-md bg-white/80" />
                  <div className="h-6 w-14 rounded-md bg-accent-blue/15" />
                </div>
                <div className="flex flex-1 items-end gap-2 rounded-xl bg-white/60 p-3">
                  {[40, 65, 50, 80, 60, 95, 70].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm"
                      style={{ height: `${h}%`, background: i === 5 ? "#f59e0b" : "#2563eb", opacity: i === 5 ? 0.85 : 0.35 }}
                    />
                  ))}
                </div>
                <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="h-10 w-full text-accent-blue" aria-hidden="true" focusable="false">
                  <defs>
                    <linearGradient id={barGradientId} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#75d7ee" />
                    </linearGradient>
                  </defs>
                  <path d="M0,30 C30,10 60,32 90,18 C120,6 150,24 200,4" fill="none" stroke={`url(#${barGradientId})`} strokeWidth="2" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
            )}

            {variant === "lp" && (
              <div className="flex h-full flex-col gap-3">
                <div className="h-1/2 rounded-xl bg-gradient-to-br from-white/90 to-accent-blue/10" />
                <div className="h-3 w-3/4 rounded-full bg-white/80" />
                <div className="h-3 w-1/2 rounded-full bg-white/60" />
                <div className="mt-auto h-8 w-28 rounded-full bg-accent-blue/80" />
              </div>
            )}

            {variant === "creative" && (
              <div className="grid h-full grid-cols-3 gap-2">
                <div className="col-span-2 rounded-lg bg-white/80" />
                <div className="rounded-lg bg-accent-amber/25" />
                <div className="rounded-lg bg-accent-blue/15" />
                <div className="col-span-2 rounded-lg bg-white/60" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
