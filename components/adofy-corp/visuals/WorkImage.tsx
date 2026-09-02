"use client";

import { useEffect, useState } from "react";

type WorkImageProps = {
  /** e.g. "/images/works/mynavi-pharmacist/creative" — .jpg/.jpeg/.png/.webp are tried in turn. */
  imageBase: string;
  alt: string;
  className?: string;
  /** Shown only while no real asset has been resolved yet — plain text, no decorative frame. */
  placeholderLabel?: string;
};

const CANDIDATE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

/**
 * Default way to show a real work/case-study image on the site: the image
 * itself, full width, intrinsic aspect ratio — no browser chrome, no card
 * border, no shadow, no added rounded corners. Any framing already baked
 * into the source image (e.g. a designer-made device mockup) is preserved
 * as-is since it's part of the asset, not something this component adds.
 *
 * Use `MockupScreen` instead only when a literal placeholder mockup is
 * explicitly wanted (e.g. no real asset exists and a stand-in browser/LP
 * sketch should fill the space).
 */
export default function WorkImage({ imageBase, alt, className = "", placeholderLabel }: WorkImageProps) {
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null);

  useEffect(() => {
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

  if (!resolvedSrc) {
    return (
      <div
        className={`relative flex aspect-[16/11] w-full items-center justify-center bg-mist-blue text-sm font-bold text-ink-soft ${className}`}
      >
        {placeholderLabel ?? "画像準備中"}
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={resolvedSrc} alt={alt} className="block h-auto w-full" />
    </div>
  );
}
