"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FAQS = [
  {
    q: "相談だけでも可能ですか？",
    a: "はい、可能です。現状の課題整理からご相談いただけます。費用や進め方のご説明も含め、まずはお気軽にお問い合わせください。",
  },
  {
    q: "小規模事業者でも依頼できますか？",
    a: "もちろん可能です。規模に応じて最適な形をご提案します。予算・目的・スケジュールに合わせた柔軟な対応を心がけています。",
  },
  {
    q: "外壁塗装会社のサイトやLPにも対応できますか？",
    a: "はい、対応可能です。地域密着型サービスに合わせた訴求設計も意識して制作します。問い合わせ獲得を目的とした導線設計も含めてご提案します。",
  },
  {
    q: "公開後の改善も相談できますか？",
    a: "はい、可能です。必要に応じて導線改善やデザイン調整も行います。公開後の効果測定や改善提案まで一貫して対応しています。",
  },
];

export default function FaqAccordion() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {FAQS.map((faq, i) => (
        <div
          key={i}
          className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
            openIdx === i
              ? "border-slate-300 bg-white shadow-sm"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <button
            className="w-full flex items-center justify-between px-6 py-5 text-left group"
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
          >
            <span className="text-sm font-semibold text-slate-900 pr-6 leading-relaxed">
              {faq.q}
            </span>
            <span
              className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                openIdx === i
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
              }`}
            >
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openIdx === i ? "rotate-45" : ""
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </span>
          </button>

          <AnimatePresence initial={false}>
            {openIdx === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
              >
                <div className="px-6 pb-5 pt-0 border-t border-slate-100">
                  <p className="text-sm text-slate-500 leading-relaxed pt-4">
                    {faq.a}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
