"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import "@/app/adofy-corp/home.css";

/**
 * adofy コーポレートサイト共通のヘッダー（全ページ）。
 * PCは横並びのメニュー、スマホ・タブレットはハンバーガーメニュー（全画面で開く）。
 * トップ以外のページでは、ヘッダーの高さ分の余白を入れて本文が隠れないようにする。
 */
export const NAV = [
  { href: "/#service", label: "Service", ja: "サービス" },
  { href: "/#works", label: "Works", ja: "実績" },
  { href: "/business", label: "Business", ja: "事業内容・会社概要" },
  { href: "/articles", label: "Column", ja: "ドライバー採用コラム" },
  { href: "/profile", label: "Profile", ja: "代表プロフィール" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/adofy-corp";
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // メニューを開いている間は、後ろのページをスクロールさせない。Escで閉じる
  useEffect(() => {
    document.documentElement.style.overflow = menu ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  // ページを移動したら閉じる
  // eslint-disable-next-line react-hooks/set-state-in-effect -- パス変更に合わせてメニューを閉じる
  useEffect(() => setMenu(false), [pathname]);

  return (
    <div className="ah ah-chrome">
      <header className={`ah-header${scrolled || !isHome ? " is-scrolled" : ""}`}>
        <Link href="/" className="ah-logo" aria-label="adofy トップへ">
          <span className="ah-logo__mark">ad</span>
          <span className="ah-logo__text">
            adofy<small>Creative Marketing Company</small>
          </span>
        </Link>
        <nav className="ah-nav" aria-label="メニュー">
          {NAV.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
          <a href="/contact" className="ah-nav__cta">
            お問い合わせ
          </a>
        </nav>
        <button
          type="button"
          className={`ah-burger${menu ? " is-open" : ""}`}
          aria-label={menu ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={menu}
          aria-controls="ah-drawer"
          onClick={() => setMenu((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <div id="ah-drawer" className={`ah-drawer${menu ? " is-open" : ""}`} aria-hidden={!menu} inert={!menu}>
        <nav aria-label="スマホメニュー">
          {NAV.map((n, i) => (
            <a key={n.href} href={n.href} onClick={() => setMenu(false)} style={{ transitionDelay: `${0.05 * i + 0.1}s` }}>
              <span className="ah-drawer__en">{n.label}</span>
              <span className="ah-drawer__ja">{n.ja}</span>
            </a>
          ))}
          <a href="/contact" onClick={() => setMenu(false)} className="ah-drawer__cta" style={{ transitionDelay: `${0.05 * NAV.length + 0.1}s` }}>
            無料で相談する
          </a>
        </nav>
        <button type="button" className="ah-drawer__close" onClick={() => setMenu(false)} aria-label="メニューを閉じる">
          <X />
        </button>
      </div>

      {!isHome && <div className="ah-header-space" aria-hidden="true" />}
    </div>
  );
}

