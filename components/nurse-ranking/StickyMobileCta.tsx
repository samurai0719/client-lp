"use client";

import { useEffect, useState } from "react";
import { getServiceByRank } from "@/config/nurse-ranking";
import AffiliateLink from "@/components/nurse-ranking/AffiliateLink";

export default function StickyMobileCta() {
  const [pastHero, setPastHero] = useState(false);
  const [closed, setClosed] = useState(false);
  const service = getServiceByRank(1);

  useEffect(() => {
    const trigger = document.getElementById("hero-cta-anchor");
    // ファーストビューのCTAが見つからない場合は、常時表示せず何もしない
    // （固定バーが不要に出続けるより、出ない方が安全なフォールバックのため）。
    if (!trigger) return;
    const obs = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(trigger);
    return () => obs.disconnect();
  }, []);

  const visible = pastHero && !closed;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 px-3 pb-3 pt-2 transition-transform duration-300 motion-reduce:transition-none sm:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white/95 p-2 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] backdrop-blur-sm">
        <AffiliateLink
          href={service.affiliateUrl}
          service={service.name}
          rank={service.rank}
          position="sticky_cta"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white active:scale-[0.98]"
        >
          1位 {service.name}を確認
        </AffiliateLink>
        <button
          type="button"
          onClick={() => setClosed(true)}
          aria-label="閉じる"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
