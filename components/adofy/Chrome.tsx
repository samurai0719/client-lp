"use client";

import { useEffect, useRef, useState } from "react";
import { NAV } from "./config";
import { isFinePointer, onScrollFrame, prefersReducedMotion } from "./motion";
import { CtaButton, Logo, LogoMark } from "./ui";

/* ═══════════════════════════════════════════════════════════════════════════
   ページ骨格まわりのクライアント要素
   （ローディング / 進捗バー / カーソルグロー / ヘッダー / スマホ追従CTA）
   ═══════════════════════════════════════════════════════════════════════════ */

const SESSION_KEY = "adofy-loaded";

/**
 * 初回表示のローディング。
 * 消える動きは CSS アニメーションだけで完結しているため、JSが動かなくても必ず消える。
 * JS が動く場合は 2回目以降のセッションで即スキップする。
 */
export function Loader() {
  const ref = useRef<HTMLDivElement>(null);

  // 状態は持たず DOM を直接操作する（再レンダリングを一切発生させない）
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // 2回目以降・モーション低減時はローディングを出さない
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* プライベートモード等では無視 */
    }

    if (seen || prefersReducedMotion()) {
      el.classList.add("is-skip");
      return;
    }

    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* 保存できなくても演出は成立する */
    }

    // CSSアニメーションで消えたあと、確実に無効化しておく
    const done = window.setTimeout(() => el.classList.add("is-done"), 1700);
    return () => window.clearTimeout(done);
  }, []);

  return (
    <div ref={ref} className="adf-loader" aria-hidden="true">
      <div className="adf-loader__inner">
        <LogoMark className="adf-loader__mark" drawable />
        <span className="adf-loader__word">adofy</span>
        <span className="adf-loader__bar">
          <i />
        </span>
      </div>
    </div>
  );
}

/** 画面上部のスクロール進捗バー。scaleX のみを更新するので再描画は起きない */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return onScrollFrame(() => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      el.style.setProperty("--adf-p", p.toFixed(4));
    });
  }, []);

  return (
    <div className="adf-progress" aria-hidden="true">
      <div ref={ref} className="adf-progress__bar" />
    </div>
  );
}

/**
 * 背景の光がマウスに追従する（独自カーソルは使わず、操作性を一切変えない）。
 * タッチ端末・モーション低減時は描画自体を行わない。
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // タッチ端末・モーション低減時はリスナーを一切張らない
    // （要素は残るが is-on が付かないため、常に透明のまま）
    if (!isFinePointer() || prefersReducedMotion()) return;

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let x = 0;
    let y = 0;

    const apply = () => {
      raf = 0;
      el.style.setProperty("--gx", `${x}px`);
      el.style.setProperty("--gy", `${y}px`);
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!el.classList.contains("is-on")) el.classList.add("is-on");
      if (!raf) raf = requestAnimationFrame(apply);
    };

    const onLeave = () => el.classList.remove("is-on");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="adf-glow" aria-hidden="true" />;
}

/** ページ内リンクを滑らかにスクロールさせる（モーション低減時は即時ジャンプ） */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = document.documentElement;
    const prev = root.style.scrollBehavior;
    root.style.scrollBehavior = "smooth";
    return () => {
      root.style.scrollBehavior = prev;
    };
  }, []);
  return null;
}

/** 固定ヘッダー＋スマホ用ドロワー */
export function Header() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    return onScrollFrame(() => {
      el.classList.toggle("is-stuck", window.scrollY > 24);
    });
  }, []);

  // ドロワーを開いている間は背面をスクロールさせない／Escで閉じる
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header ref={headerRef} className="adf-header">
        <div className="adf-header__inner">
          <a href="#top" className="adf-logo" aria-label="adofy トップへ">
            <LogoMark className="adf-logo__mark" />
            <span className="adf-logo__text">
              adof<b>y</b>
            </span>
          </a>

          <nav className="adf-nav" aria-label="メインナビゲーション">
            {NAV.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="adf-header__cta">
            <CtaButton size="sm" />
          </div>

          <button
            type="button"
            className="adf-burger"
            aria-expanded={open}
            aria-controls="adf-drawer"
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
            onClick={() => setOpen((v) => !v)}
          >
            <i />
            <i />
            <i />
          </button>
        </div>
      </header>

      <div
        id="adf-drawer"
        className={`adf-drawer${open ? " is-open" : ""}`}
        aria-label="メニュー"
      >
        {NAV.map((item, i) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
            <span className="adf-drawer__num">{String(i + 1).padStart(2, "0")}</span>
          </a>
        ))}
        <div className="adf-drawer__cta">
          <CtaButton onClick={() => setOpen(false)} />
        </div>
      </div>
    </>
  );
}

/** スマホ画面下部の追従CTA。ファーストビューを過ぎてから出す */
export function MobileFixedCta() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return onScrollFrame(() => {
      el.classList.toggle("is-show", window.scrollY > window.innerHeight * 0.55);
    });
  }, []);

  return (
    <div ref={ref} className="adf-fixedcta">
      <CtaButton />
    </div>
  );
}

/** Logo を named export として再利用できるように */
export { Logo };
