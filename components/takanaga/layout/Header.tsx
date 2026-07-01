"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Phone, Clipboard, Cpu } from "lucide-react";
import { siteConfig } from "@/data/takanaga/siteConfig";

const NAV_LINKS = [
  { href: "/takanaga/services", label: "工事内容" },
  { href: "/takanaga/works", label: "施工事例" },
  { href: "/takanaga/strengths", label: "選ばれる理由" },
  { href: "/takanaga/price", label: "費用目安" },
  { href: "/takanaga/flow", label: "ご依頼の流れ" },
  { href: "/takanaga/company", label: "会社案内" },
  { href: "/takanaga/faq", label: "FAQ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="tkn-header">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* ロゴ */}
            <Link
              href="/takanaga"
              className="flex items-center gap-2.5 shrink-0"
              aria-label="高長建設 トップページ"
            >
              <Image
                src="/images/gaikou/logo-transparent.png"
                alt=""
                width={36}
                height={36}
                className="w-9 h-9 object-contain"
                priority
              />
              <span className="text-base font-bold text-(--tkn-navy-deep) tracking-wide">
                高長建設
              </span>
            </Link>

            {/* デスクトップナビ */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="メインメニュー">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="tkn-nav-link">
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* デスクトップCTA */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <Link
                href={siteConfig.externalLinks.simulatorUrl}
                className="tkn-btn-outline !text-xs !py-2 !px-4"
              >
                AIシミュレーション
              </Link>
              <Link href="/takanaga/contact" className="tkn-btn-primary !text-sm !py-2.5 !px-5">
                無料現地調査を相談
              </Link>
            </div>

            {/* ハンバーガー */}
            <button
              type="button"
              className="lg:hidden p-2 rounded text-(--tkn-navy-deep)"
              aria-label={open ? "メニューを閉じる" : "メニューを開く"}
              aria-expanded={open}
              aria-controls="tkn-mobile-menu"
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* モバイルメニュー（フルスクリーン青オーバーレイ） */}
      {open && (
        <div
          id="tkn-mobile-menu"
          className="fixed inset-0 z-[49] flex flex-col pt-16 overflow-y-auto"
          style={{ background: "linear-gradient(160deg, #0f2744 0%, #1a3d6b 60%, #1d5fa6 100%)" }}
          role="dialog"
          aria-label="モバイルメニュー"
        >
          {/* 閉じるボタン（右上） */}
          <button
            type="button"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="メニューを閉じる"
            onClick={() => setOpen(false)}
          >
            <X size={22} />
          </button>

          {/* ロゴ */}
          <div className="px-6 pb-4 border-b border-white/10">
            <Link
              href="/takanaga"
              className="flex items-center gap-2.5"
              onClick={() => setOpen(false)}
            >
              <Image
                src="/images/gaikou/logo-transparent.png"
                alt=""
                width={32}
                height={32}
                className="w-8 h-8 object-contain brightness-0 invert"
              />
              <span className="text-base font-bold text-white tracking-wide">高長建設</span>
            </Link>
          </div>

          <nav className="flex flex-col divide-y divide-white/10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-6 py-4 text-white text-base font-semibold hover:bg-white/10 transition-colors flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-(--tkn-blue-bright) shrink-0" aria-hidden />
                {link.label}
              </Link>
            ))}
            <Link
              href="/takanaga/contact"
              className="px-6 py-4 text-white text-base font-semibold hover:bg-white/10 transition-colors flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-(--tkn-blue-bright) shrink-0" aria-hidden />
              お問い合わせ
            </Link>
            <Link
              href={siteConfig.externalLinks.simulatorUrl}
              className="px-6 py-4 text-white text-base font-semibold hover:bg-white/10 transition-colors flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-(--tkn-blue-bright) shrink-0" aria-hidden />
              AIシミュレーション
            </Link>
          </nav>

          <div className="p-6 mt-4 flex flex-col gap-3">
            <Link
              href="/takanaga/contact"
              className="tkn-btn-primary w-full justify-center text-center"
              onClick={() => setOpen(false)}
            >
              無料で現地調査を相談する
            </Link>
            {siteConfig.contact.phone ? (
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="tkn-btn-outline w-full justify-center !text-white !border-white"
                onClick={() => setOpen(false)}
              >
                <Phone size={16} />
                電話で相談する
              </a>
            ) : null}
          </div>
        </div>
      )}

      {/* モバイル固定CTA */}
      <div className="tkn-mobile-cta lg:hidden" role="navigation" aria-label="クイックアクション">
        {siteConfig.contact.phone ? (
          <a
            href={`tel:${siteConfig.contact.phone}`}
            className="tkn-mobile-cta-btn"
            aria-label={`電話で相談する: ${siteConfig.contact.phone}`}
          >
            <Phone size={18} aria-hidden />
            <span>電話で相談</span>
          </a>
        ) : (
          <button
            type="button"
            className="tkn-mobile-cta-btn"
            disabled
            aria-label="電話番号は準備中です"
          >
            <Phone size={18} aria-hidden />
            <span>電話で相談</span>
          </button>
        )}

        <Link
          href="/takanaga/contact"
          className="tkn-mobile-cta-btn tkn-mobile-cta-primary"
          aria-label="無料見積もりを相談する"
        >
          <Clipboard size={18} aria-hidden />
          <span>無料見積もり</span>
        </Link>

        <Link
          href={siteConfig.externalLinks.simulatorUrl}
          className="tkn-mobile-cta-btn"
          aria-label="AIシミュレーションを試す"
        >
          <Cpu size={18} aria-hidden />
          <span>AIシミュレーション</span>
        </Link>
      </div>
    </>
  );
}
