"use client";

import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { ArrowRight, Check } from "lucide-react";
import { PATHS } from "@/config/driver-company";
import { trackCompany } from "../track";
import { CTA_LABEL, CTA_SUB, REASSURE } from "./content";

/**
 * 求人登録フォーム（/company/register）へのCTA。
 * クリック時に company_cta_click を送る。問い合わせ・電話相談の導線は作らない
 * （ドラテクは完全自動型で、運営者が相談対応をしないため）。
 */
export function CtaButton({
  location,
  label = CTA_LABEL,
  size = "lg",
  sub = true,
}: {
  location: string;
  label?: string;
  size?: "sm" | "lg";
  /** ボタン内に「登録・掲載・月額0円」を添えるか */
  sub?: boolean;
}) {
  return (
    <Link
      href={PATHS.register}
      className={`dt-btn dt-btn--${size}`}
      onClick={() => trackCompany("company_cta_click", { cta_location: location })}
    >
      <span className="dt-btn__body">
        {size === "lg" && sub && <span className="dt-btn__sub">{CTA_SUB}</span>}
        <span className="dt-btn__label">{label}</span>
      </span>
      <ArrowRight className="dt-btn__arrow" aria-hidden="true" strokeWidth={2.8} />
    </Link>
  );
}

/** セクション途中のCTA。後押しの一言＋挿絵＋ボタン＋安心材料 */
export function CtaBlock({
  location,
  lead,
  art,
  invert = false,
}: {
  location: string;
  lead?: ReactNode;
  art?: ReactNode;
  invert?: boolean;
}) {
  return (
    <div className={`dt-ctablock${invert ? " dt-ctablock--invert" : ""}`}>
      {art && <div className="dt-ctablock__art">{art}</div>}
      {lead && <p className="dt-ctablock__lead">{lead}</p>}
      <CtaButton location={location} />
      <Reassure />
    </div>
  );
}

/** CTA直下の安心材料 */
export function Reassure({ invert = false }: { invert?: boolean }) {
  return (
    <ul className={`dt-reassure${invert ? " dt-reassure--invert" : ""}`}>
      {REASSURE.map((r) => (
        <li key={r}>
          <Check aria-hidden="true" strokeWidth={3.2} />
          {r}
        </li>
      ))}
    </ul>
  );
}

/** セクション見出し（小見出し＋大見出し＋リード） */
export function SectionHead({
  eyebrow,
  title,
  lead,
  id,
  invert = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  invert?: boolean;
}) {
  return (
    <header className={`dt-head${invert ? " dt-head--invert" : ""}`}>
      {eyebrow && <p className="dt-head__eyebrow">{eyebrow}</p>}
      <h2 className="dt-head__title" id={id}>
        {title}
      </h2>
      {lead && <p className="dt-head__lead">{lead}</p>}
    </header>
  );
}

/**
 * "|" を <wbr>（ここで改行してよい）に変換する。
 * CSS の word-break: keep-all と組み合わせ、日本語が単語の途中で折り返されないようにする。
 */
export function Breakable({ text }: { text: string }) {
  return (
    <>
      {text.split("|").map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <wbr />}
          {part}
        </Fragment>
      ))}
    </>
  );
}

/** "**強調**" 記法を <strong> に変換して表示する */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((p, i) => (i % 2 === 1 ? <strong key={i}>{p}</strong> : <Fragment key={i}>{p}</Fragment>))}
    </>
  );
}
