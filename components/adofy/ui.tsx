"use client";

import React, { type CSSProperties, type ReactNode } from "react";
import { CTA_EXTERNAL, CTA_HREF, CTA_LABEL, CTA_NOTES } from "./config";
import { stagger, useInView, useMagnetic } from "./motion";

/* ═══════════════════════════════════════════════════════════════════════════
   ページ全体で使い回す共通パーツ。
   演出のタイミング・距離・イージングは adofy.css の CSS変数で一元管理する。
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── ロゴ ───────────────────────────────────────────────────────────────── */

/** 建物の輪郭＋上昇グラフを組み合わせた adofy のシンボル */
export function LogoMark({ className, drawable = false }: { className?: string; drawable?: boolean }) {
  const d = drawable ? { "data-draw": true } : {};
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      {/* 屋根（A のシルエット） */}
      <path {...d} style={{ "--len": 92, "--adf-i": 0 } as CSSProperties} d="M6 40 L24 8 L42 40" />
      {/* 梁 */}
      <path {...d} style={{ "--len": 24, "--adf-i": 1 } as CSSProperties} d="M15 26 L33 26" />
      {/* 上昇グラフ */}
      <path
        {...d}
        style={{ "--len": 46, "--adf-i": 2 } as CSSProperties}
        d="M17 40 L17 34 M24 40 L24 29 M31 40 L31 23"
        strokeWidth="3"
      />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`adf-logo ${className}`}>
      <LogoMark className="adf-logo__mark" />
      <span className="adf-logo__text">
        adof<b>y</b>
      </span>
    </span>
  );
}

/* ── アイコン ───────────────────────────────────────────────────────────── */

export function ArrowIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      className="adf-cta__arrow"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h13M12 5l7 7-7 7" />
    </svg>
  );
}

export function CheckIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12.5 9.5 18 20 6" />
    </svg>
  );
}

/* ── 登場アニメーション ─────────────────────────────────────────────────── */

type RevealProps = {
  children: ReactNode;
  variant?: "up" | "down" | "left" | "right" | "scale" | "wipe";
  index?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "p" | "figure";
  style?: CSSProperties;
  id?: string;
};

export function Reveal({
  children,
  variant = "up",
  index = 0,
  className = "",
  as: Tag = "div",
  style,
  id,
}: RevealProps) {
  const ref = useInView<HTMLDivElement>();
  const Comp = Tag as React.ElementType;
  return (
    <Comp
      id={id}
      ref={ref}
      className={`adf-reveal adf-reveal--${variant}${className ? ` ${className}` : ""}`}
      style={{ ...stagger(index), ...style }}
    >
      {children}
    </Comp>
  );
}

/* ── セクション見出し ───────────────────────────────────────────────────── */

export function SectionHeading({
  eyebrow,
  title,
  lead,
  center = false,
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  center?: boolean;
  id?: string;
}) {
  const ref = useInView<HTMLDivElement>({ threshold: 0.25 });
  return (
    <div ref={ref} className={`adf-head${center ? " adf-head--center" : ""}`}>
      <p className="adf-head__eyebrow">
        <span className="adf-head__tick" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 className="adf-head__title" id={id}>
        {title}
      </h2>
      <span className="adf-head__rule" aria-hidden="true" />
      {lead ? <p className="adf-head__lead">{lead}</p> : null}
    </div>
  );
}

/* ── CTAボタン ──────────────────────────────────────────────────────────── */

export function CtaButton({
  size = "lg",
  className = "",
  label = CTA_LABEL,
  onClick,
  href,
}: {
  size?: "lg" | "sm";
  className?: string;
  label?: string;
  onClick?: () => void;
  /** 料金プランのCTAなど、プラン付きURLへ遷移させたい場合に指定する */
  href?: string;
}) {
  const ref = useMagnetic<HTMLAnchorElement>();
  const external = CTA_EXTERNAL
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <a
      ref={ref}
      href={href ?? CTA_HREF}
      className={`adf-cta${size === "sm" ? " adf-cta--sm" : ""}${className ? ` ${className}` : ""}`}
      onClick={onClick}
      {...external}
    >
      <span className="adf-cta__label">{label}</span>
      <ArrowIcon size={size === "sm" ? 15 : 18} />
    </a>
  );
}

/** CTA＋補足（相談無料など）。ページ中盤・最終CTAでは視線誘導ラインを出す */
export function CtaBlock({
  guide = false,
  notes = true,
  className = "",
  href,
}: {
  guide?: boolean;
  notes?: boolean;
  className?: string;
  href?: string;
}) {
  const ref = useInView<SVGSVGElement>({ threshold: 0.4 });
  return (
    <div className={`adf-cta-wrap ${className}`}>
      {guide ? (
        <svg
          ref={ref}
          className="adf-cta-guide"
          viewBox="0 0 220 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          aria-hidden="true"
        >
          <path d="M4 4 C 40 34, 80 38, 110 38 C 140 38, 180 34, 216 4" strokeDasharray="4 5" />
          <path d="M104 32 L110 39 L116 32" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
      <CtaButton href={href} />
      {notes ? (
        <p className="adf-cta-note">
          {CTA_NOTES.map((n) => (
            <span key={n}>
              <CheckIcon size={13} />
              {n}
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}

/* ── 設計図グリッド（装飾） ─────────────────────────────────────────────── */

export function BlueprintGrid({
  tone = "dark",
  opacity = 0.5,
}: {
  tone?: "dark" | "light";
  opacity?: number;
}) {
  const stroke = tone === "dark" ? "#7fb2e8" : "#1c4a76";
  const uid = tone === "dark" ? "adf-bpd" : "adf-bpl";
  return (
    <svg className="adf-blueprint" style={{ opacity }} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`${uid}-fine`} width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0 L0 0 0 28" fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.16" />
        </pattern>
        <pattern id={`${uid}-bold`} width="140" height="140" patternUnits="userSpaceOnUse">
          <rect width="140" height="140" fill={`url(#${uid}-fine)`} />
          <path d="M140 0 L0 0 0 140" fill="none" stroke={stroke} strokeWidth="0.9" opacity="0.22" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${uid}-bold)`} />
      {/* 寸法線と設計記号 */}
      <g stroke={stroke} strokeWidth="0.9" opacity="0.3" fill="none">
        <path d="M40 78 L200 78 M40 72 L40 84 M200 72 L200 84" />
        <circle cx="120" cy="78" r="3.5" />
      </g>
    </svg>
  );
}
