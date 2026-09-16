"use client";

import { useEffect, useRef, useState } from "react";
import { hotaruConfig as c } from "@/config/hotaru";
import Logo from "./Logo";

const NAV = [
  { href: "#about", label: "蛍について" },
  { href: "#menu", label: "料理とお酒" },
  { href: "#access", label: "アクセス" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    // PC幅に広がったら閉じる
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  return (
    <header className="ht-header fixed inset-x-0 top-0 z-50">
      <a href="#main" className="ht-skip">
        本文へスキップ
      </a>
      <div className="ht-container flex h-(--ht-header-h) items-center justify-between gap-6">
        <a href="#top" className="ht-focus-dark -mx-1 inline-flex rounded-sm px-1 py-1">
          <Logo tone="light" />
        </a>

        {/* PC・タブレット */}
        <nav aria-label="メインメニュー" className="hidden md:block">
          <ul className="flex items-center gap-7 lg:gap-9">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="ht-navlink ht-focus-dark">
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`tel:${c.contact.phoneTel}`}
                className="ht-btn ht-btn--primary ht-focus-dark min-h-11 px-5 text-[15px]"
              >
                <PhoneIcon />
                お電話
              </a>
            </li>
          </ul>
        </nav>

        {/* スマホ */}
        <button
          ref={toggleRef}
          type="button"
          className="ht-menu-toggle ht-focus-dark md:hidden"
          aria-expanded={open}
          aria-controls="ht-mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="ht-menu-toggle__bars" data-open={open} aria-hidden="true">
            <span />
            <span />
          </span>
          <span className="text-[13px] tracking-wider">{open ? "閉じる" : "メニュー"}</span>
        </button>
      </div>

      <nav
        id="ht-mobile-menu"
        aria-label="メインメニュー"
        className="ht-mobile-menu md:hidden"
        hidden={!open}
      >
        <ul className="ht-container pb-5 pt-1">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="ht-mobile-menu__link ht-focus-dark"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li className="pt-4">
            <a
              href={`tel:${c.contact.phoneTel}`}
              className="ht-btn ht-btn--primary ht-focus-dark w-full"
              onClick={() => setOpen(false)}
            >
              <PhoneIcon />
              お電話 {c.contact.phoneDisplay}
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export function PhoneIcon({ className = "size-[18px]" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function MapIcon({ className = "size-[18px]" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
