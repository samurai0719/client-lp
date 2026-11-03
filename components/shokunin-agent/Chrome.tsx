"use client";

import { useEffect, useState } from "react";
import { HardHat, Menu, MessageCircle, X } from "lucide-react";
import { openChat } from "./ChatConsult";
import { CTA_HREF, NAV, SERVICE_NAME } from "./config";

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
        <button type="button" className="sa-header__tel" onClick={openChat} data-sr-cta="header-chat">
          <MessageCircle aria-hidden="true" strokeWidth={2.6} />
          チャットで相談
        </button>
        <a href={CTA_HREF} className="sa-header__cta" data-sr-cta="header">
          無料相談
        </a>
        <button type="button" className="sa-header__call" onClick={openChat} aria-label="チャットで相談する" data-sr-cta="header-chat-icon">
          <MessageCircle aria-hidden="true" strokeWidth={2.4} />
        </button>
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

const REVEAL_TARGETS = [
  ".ks-head",
  ".ks-card",
  ".sa-cost__table",
  ".sa-cost__diff",
  ".sa-worry__owner",
  ".ks-total",
  ".ks-plan",
  ".ks-step",
  ".ks-faq__item",
  ".ks-contact__art",
  ".sa-form-card",
].join(",");

/**
 * スクロールで要素をフェード＋軽いスライドで表示する。描画は何もしない。
 * JSが動かない環境や prefers-reduced-motion では何もせず、最初からすべて表示される。
 */
export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll<HTMLElement>(REVEAL_TARGETS).forEach((el) => {
      const index = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0;
      el.style.setProperty("--sa-delay", `${(index % 3) * 90}ms`);
      el.classList.add("sa-reveal");
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return null;
}
