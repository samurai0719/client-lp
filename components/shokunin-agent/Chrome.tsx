"use client";

import { useEffect, useState } from "react";
import { ArrowRight, HardHat, Menu, X } from "lucide-react";
import { CTA_HREF, CTA_MAIN, NAV, SERVICE_NAME } from "./config";

/** ヘッダー。スマホではハンバーガーメニューに畳む */
export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sa-header">
      <div className="sa-header__inner">
        <a href="#hero" className="sa-logo" aria-label={`${SERVICE_NAME} トップへ`}>
          <HardHat aria-hidden="true" strokeWidth={2.4} />
          <span>
            職人採用<em>エージェント</em>
          </span>
        </a>
        <nav className="sa-nav" aria-label="ページ内">
          {NAV.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
        <a href={CTA_HREF} className="sa-header__cta" data-sr-cta="header">
          無料相談
        </a>
        <button
          type="button"
          className="sa-menu-btn"
          aria-expanded={open}
          aria-controls="sa-mobile-nav"
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <nav className="sa-mobile-nav" id="sa-mobile-nav" aria-label="ページ内（スマホ）">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)}>
              {n.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

/**
 * スマホ下部の固定CTA（PCでは非表示）。
 * FVのCTA・相談フォーム・フッターが見えている間は隠し、ボタンの二重表示や入力欄・フッターへの重なりを防ぐ。
 */
export function StickyCta() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const targets = [".sa-hero__cta", "#contact", ".sr-footer"]
      .map((s) => document.querySelector(s))
      .filter((el): el is Element => el !== null);
    const seen = new Map<Element, boolean>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) seen.set(e.target, e.isIntersecting);
      setHidden([...seen.values()].some(Boolean));
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <div className={`sr-sticky${hidden ? " is-hidden" : ""}`} aria-hidden={hidden}>
      <a href={CTA_HREF} className="sr-btn sr-btn--lg sr-btn--primary sr-sticky__btn ks-btn" data-sr-cta="sticky" tabIndex={hidden ? -1 : 0}>
        <span>{CTA_MAIN}</span>
        <ArrowRight className="sr-btn__arrow" aria-hidden="true" strokeWidth={2.6} />
      </a>
    </div>
  );
}
