"use client";

import { useState, useEffect } from "react";

const NAV = [
  { href: "#reasons", label: "選ばれる理由" },
  { href: "#services", label: "事業内容" },
  { href: "#results", label: "実績" },
  { href: "#company", label: "会社概要" },
  { href: "#contact", label: "お問い合わせ" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/96 backdrop-blur-md shadow-sm border-b border-slate-100"
          : "bg-white/0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/company" className="group flex items-center gap-3">
          <span className="text-[1.3rem] font-black tracking-[-0.04em] text-slate-900 group-hover:text-slate-600 transition-colors">
            adofy
          </span>
          <span className="hidden sm:block text-[10px] font-medium text-slate-400 tracking-widest">
            株式会社adofy
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors tracking-wide"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA + burger */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 active:scale-[0.98] text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg transition-all shadow-sm"
          >
            お問い合わせ
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>

          <button
            className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="メニュー開閉"
          >
            {open ? (
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="3" y1="8" x2="21" y2="8" />
                <line x1="3" y1="16" x2="21" y2="16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl">
          <nav className="max-w-7xl mx-auto px-6 py-5 flex flex-col">
            {NAV.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="py-3.5 text-sm font-medium text-slate-700 hover:text-slate-900 border-b border-slate-50 last:border-0 transition-colors"
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
            <a
              href="#contact"
              className="mt-4 flex items-center justify-center gap-2 bg-slate-900 text-white text-sm font-semibold px-4 py-3.5 rounded-xl"
              onClick={() => setOpen(false)}
            >
              お問い合わせ
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
