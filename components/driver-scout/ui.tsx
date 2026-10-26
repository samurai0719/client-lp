"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { SERVICE } from "@/config/driver-company";
import { trackCompany } from "../driver-company/track";
import { CTA_AFTER, CTA_HREF, CTA_LABEL, CTA_POINTS, DISCLOSE_LABEL, registerHref, SCOUT_PATHS, SERVICE_KIND, SERVICE_NAME } from "./content";
import { OPEN_INTERVIEW_EVENT } from "./events";
import { useWaitingCount, WaitingLine } from "./waiting";

/**
 * CTA。文言は「無料で求職者情報を見てみる」だけ。押すと匿名プロフィール一覧（/profiles）へ進む。
 * クリック時に company_cta_click（form=scout）を送る。
 */
export function ScoutCta({ location, size = "lg", note = true }: { location: string; size?: "lg" | "sm"; note?: boolean }) {
  return (
    <div className={size === "lg" ? "ds-cta" : undefined}>
      {size === "lg" && <WaitingLine />}
      <a
        href={CTA_HREF}
        className={`dt-btn dt-btn--${size}`}
        onClick={() => trackCompany("company_cta_click", { cta_location: `scout_${location}` })}
      >
        <span className="dt-btn__body">
          <span className="dt-btn__label">{CTA_LABEL}</span>
        </span>
        {size === "lg" && <ArrowRight className="dt-btn__arrow" aria-hidden="true" strokeWidth={2.8} />}
      </a>
      {size === "lg" && note && (
        <ul className="ds-cta__points" aria-label="閲覧の条件">
          {CTA_POINTS.map((t) => (
            <li key={t}>
              <Check aria-hidden="true" strokeWidth={3} />
              {t}
            </li>
          ))}
        </ul>
      )}
      {size === "lg" && note && <p className="ds-cta__after">{CTA_AFTER}</p>}
    </div>
  );
}

/** ヘッダー。離脱を防ぐためナビゲーションは置かず、ロゴとCTAだけ。LP以外ではロゴでLPへ戻る */
export function Header({ home = true, cta = true }: { home?: boolean; cta?: boolean }) {
  return (
    <header className="dt-header">
      <div className="dt-header__inner">
        <a href={home ? "#top" : SCOUT_PATHS.lp} className="dt-logo" aria-label={home ? `${SERVICE_NAME} ページの先頭へ` : `${SERVICE_NAME} トップへ`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={SERVICE.logo} alt="" width={640} height={645} className="dt-logo__img" />
          <span className="dt-logo__text">
            <span className="dt-logo__name">{SERVICE_NAME}</span>
            <span className="dt-logo__sub">運送会社向け {SERVICE_KIND}</span>
          </span>
        </a>
        {cta && (
          <span className="ds-header-cta">
            <ScoutCta location="header" size="sm" />
          </span>
        )}
      </div>
    </header>
  );
}

/**
 * スマホ下部の固定CTA。FVが見えている間は隠す（ボタンが二重に見えるため）。
 */
export function StickyCta() {
  const [hidden, setHidden] = useState(true);
  const waiting = useWaitingCount();

  useEffect(() => {
    const targets = ["top"].map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;
    const visible = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target, e.isIntersecting);
        setHidden([...visible.values()].some(Boolean));
      },
      { rootMargin: "0px 0px -35% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div className={`dt-sticky${hidden ? " is-hidden" : ""}`} aria-hidden={hidden}>
      <a
        href={CTA_HREF}
        className="dt-btn dt-btn--lg dt-sticky__btn"
        tabIndex={hidden ? -1 : 0}
        onClick={() => trackCompany("company_cta_click", { cta_location: "scout_sticky" })}
      >
        <span className="dt-btn__body">
          {waiting !== null ? (
            <span className="dt-sticky__chip ds-sticky-waiting">{waiting.toLocaleString("ja-JP")}人のドライバーが待機中</span>
          ) : (
            <span className="dt-sticky__chip">初期費用・月額0円</span>
          )}
          <span className="dt-btn__label">{CTA_LABEL}</span>
        </span>
        <ArrowRight className="dt-btn__arrow" aria-hidden="true" strokeWidth={2.8} />
      </a>
    </div>
  );
}

/**
 * 匿名プロフィールの「この方と面接を希望する」ボタン。
 * 押すと面接希望のライトボックス（InterviewModal）が開く。JSが動かない環境では、リンク先の /register へ進む。
 */
export function DiscloseButton({ no }: { no: string }) {
  return (
    <a
      href={registerHref(no)}
      role="button"
      className="dt-btn dt-btn--lg ds-disclose__btn"
      onClick={(e) => {
        e.preventDefault();
        trackCompany("company_disclose_click", { candidate: no });
        window.dispatchEvent(new CustomEvent(OPEN_INTERVIEW_EVENT, { detail: no }));
      }}
    >
      <span className="dt-btn__body">
        <span className="dt-btn__label">{DISCLOSE_LABEL}</span>
      </span>
      <ArrowRight className="dt-btn__arrow" aria-hidden="true" strokeWidth={2.8} />
    </a>
  );
}
