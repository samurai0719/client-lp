"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { withEmphasis } from "./emphasis";

// ─── 記事LP共通カラー ────────────────────────────────────────────────────
export const GR_COLORS = {
  bgWarm: "#F8F4EC",
  bgLight: "#FFFDF9",
  textDark: "#2E2923",
  olive: "#566342",
  oliveLight: "#879174",
  gold: "#B7812D",
  border: "#DDD3C2",
};

// ─── スクロールでフェードイン（globals.css の section-fade / in-view を使用） ──
function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = () => el.classList.add("in-view");
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      show();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.unobserve(el);
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export function FadeUp({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useFadeUp();
  return (
    <div ref={ref} className={`section-fade ${className}`}>
      {children}
    </div>
  );
}

// ─── 記事の最大幅コンテナ（読みやすさのため680〜760px程度に制限） ─────────
export function ArticleContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[680px] px-5 sm:px-6 ${className}`}>{children}</div>;
}

// ─── セクション見出し（明朝系） ───────────────────────────────────────────
export function SectionHeading({
  children,
  id,
  eyebrow,
  light = false,
}: {
  children: ReactNode;
  id?: string;
  eyebrow?: string;
  light?: boolean;
}) {
  return (
    <div className="mb-7 sm:mb-9">
      {eyebrow && (
        <p
          className="mb-2.5 text-[11px] font-bold tracking-[0.24em] uppercase"
          style={{ color: GR_COLORS.gold }}
        >
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className="gr-font-serif text-balance text-[1.4rem] sm:text-[1.7rem] leading-[1.65] font-bold"
        style={{ color: light ? GR_COLORS.bgLight : GR_COLORS.textDark, letterSpacing: "0.02em" }}
      >
        {withEmphasis(children, light)}
      </h2>
    </div>
  );
}

// ─── 本文段落 ─────────────────────────────────────────────────────────────
export function BodyText({
  children,
  className = "",
  light = false,
}: {
  children: ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <p
      className={`text-[16px] sm:text-[17.5px] leading-[1.9] tracking-[0.01em] ${className}`}
      style={{ color: light ? GR_COLORS.bgLight : GR_COLORS.textDark }}
    >
      {withEmphasis(children, light)}
    </p>
  );
}

// ─── スクリーンリーダー専用の見出し（画像内テキストと重複させないためのSEO見出し） ──
export function VisuallyHiddenHeading({
  children,
  as = "h1",
  id,
}: {
  children: ReactNode;
  as?: "h1" | "h2";
  id?: string;
}) {
  const Tag = as;
  return (
    <Tag id={id} className="sr-only">
      {children}
    </Tag>
  );
}
