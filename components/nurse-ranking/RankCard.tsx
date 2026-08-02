"use client";

import { useState } from "react";
import type { Service } from "@/config/nurse-ranking";
import RankMedal from "@/components/nurse-ranking/RankMedal";
import AffiliateLink from "@/components/nurse-ranking/AffiliateLink";

const CARD_ACCENT: Record<1 | 2 | 3, string> = {
  1: "border-amber-300 shadow-[0_4px_24px_rgba(217,164,6,0.12)]",
  2: "border-slate-200",
  3: "border-orange-200",
};

const BADGE_TEXT: Record<1 | 2 | 3, string> = {
  1: "総合1位",
  2: "総合2位",
  3: "総合3位",
};

export default function RankCard({ service }: { service: Service }) {
  const [open, setOpen] = useState(false);
  const panelId = `rank-detail-${service.rank}`;

  return (
    <article
      className={`rounded-3xl border-2 bg-white p-5 sm:p-7 ${CARD_ACCENT[service.rank]}`}
      aria-labelledby={`rank-title-${service.rank}`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <RankMedal rank={service.rank} size="lg" />
        <div>
          <span className="text-[11px] font-semibold text-slate-400">{BADGE_TEXT[service.rank]}</span>
          <h3 id={`rank-title-${service.rank}`} className="text-lg font-extrabold text-slate-900 sm:text-xl">
            {service.name}
          </h3>
        </div>
      </div>

      {/* ロゴ用スペース（ロゴ素材がないためテキスト表示。公式ロゴの無断転載はしない） */}
      <div className="mt-4 flex h-14 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-sm font-semibold tracking-wide text-slate-400">
        {service.name}（公式ロゴ準備中）
      </div>

      <p className="mt-4 text-sm font-medium leading-relaxed text-slate-700 sm:text-base">
        {service.shortConclusion}
      </p>

      <ul className="mt-4 space-y-2">
        {service.points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-slate-600">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {p}
          </li>
        ))}
      </ul>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-teal-50 p-3.5">
          <p className="mb-1.5 text-xs font-semibold text-teal-700">向いている人</p>
          <ul className="space-y-1">
            {service.recommendedFor.map((r) => (
              <li key={r} className="text-xs leading-relaxed text-teal-800">・{r}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-amber-50 p-3.5">
          <p className="mb-1.5 text-xs font-semibold text-amber-700">注意点</p>
          <p className="text-xs leading-relaxed text-amber-800">{service.caution}</p>
        </div>
      </div>

      {/* 詳細アコーディオン */}
      <div className="mt-4 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center justify-between text-left text-sm font-semibold text-teal-700"
        >
          詳細を見る
          <svg
            className={`h-4 w-4 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <div
          id={panelId}
          className="grid transition-[grid-template-rows] duration-300 ease-in-out motion-reduce:transition-none"
          style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div className="pt-3 text-xs leading-relaxed text-slate-500 space-y-2">
              <p>相談料金：{service.consultationFee} ／ 連絡手段：{service.contactMethods}</p>
              <p>規模・実績：{service.scaleFact}</p>
              <p>
                情報確認日：{service.sourceCheckedAt}（
                <a href={service.officialReferenceUrl} target="_blank" rel="noopener noreferrer" className="underline">
                  公式サイトで確認する
                </a>
                ）
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2.5">
        <AffiliateLink
          href={service.affiliateUrl}
          service={service.name}
          rank={service.rank}
          position="rank_card"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-teal-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-teal-700 active:scale-[0.98] sm:text-base"
        >
          {service.ctaLabel}
        </AffiliateLink>
        <p className="text-center text-[11px] text-slate-400">登録・相談無料</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-1.5 rounded-full border border-slate-200 px-6 py-2.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50"
        >
          特徴を詳しく見る
        </button>
      </div>
    </article>
  );
}
