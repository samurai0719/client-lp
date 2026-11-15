"use client";

import { useId, useState } from "react";
import type { Service } from "@/config/nurse-ranking";
import { OfficialButton, RankBadge, Rich } from "./ui";
import { CheckIcon } from "./WorkStyleSection";

/**
 * ランキング詳細カード（1位・2位・3位で同じ構成。タブはカードごとに独立）。
 *   ①順位とサービス名 ②広告素材（無ければ文字） ③CTA ④基本情報／サポート内容タブ
 *   ⑤おすすめポイント3つ ⑥こんな人におすすめ ⑦CTA ⑧出典・数値の注記
 * 1位は金色の枠と淡い黄色の背景、数値のハイライトを追加して情報を厚くする。
 */

const FRAME = {
  1: "border-[3px] border-[#e7b416] bg-[#fffbe6]",
  2: "border-2 border-[#c3cbd6] bg-white",
  3: "border-2 border-[#d99a62] bg-white",
} as const;

const RIBBON = {
  1: "bg-gradient-to-r from-[#e7b416] to-[#f5cf4a]",
  2: "bg-gradient-to-r from-[#9aa4b1] to-[#c3cbd6]",
  3: "bg-gradient-to-r from-[#b8784a] to-[#d99a62]",
} as const;

export default function RankCard({ s }: { s: Service }) {
  const [tab, setTab] = useState<"basic" | "support">("basic");
  const uid = useId();
  const rows = tab === "basic" ? s.basicInfo : s.supportInfo;

  return (
    <article id={`rank-${s.rank}`} aria-labelledby={`${uid}-title`} className={`scroll-mt-4 overflow-hidden rounded-2xl ${FRAME[s.rank]}`}>
      {/* ① 順位とサービス名 */}
      <header className={`flex items-center gap-2.5 px-4 py-2.5 text-white ${RIBBON[s.rank]}`}>
        <span className="rounded-full bg-white p-1 shadow-sm">
          <RankBadge rank={s.rank} />
        </span>
        <div className="min-w-0">
          <p className="text-[12px] font-bold leading-none [text-shadow:0_1px_1px_rgba(0,0,0,0.25)]">第{s.rank}位</p>
          <h3 id={`${uid}-title`} className="mt-1 text-[19px] font-black leading-tight [text-shadow:0_1px_2px_rgba(0,0,0,0.25)]">
            {s.name}
            {s.sub && <span className="ml-1.5 text-[11px] font-bold opacity-95">（{s.sub}）</span>}
          </h3>
        </div>
      </header>

      <div className="px-4 pb-5 pt-4">
        <p className="mb-3 text-center text-[15px] font-black leading-snug text-slate-900">
          <span className="bg-[linear-gradient(transparent_55%,#fff176_55%)]">{s.catchcopy}</span>
        </p>

        {/* ② 正規の広告素材。無いサービスはロゴを作らず文字で表示する */}
        {s.adImage ? (
          <a href={s.affiliateUrl ?? s.officialUrl} target="_blank" rel="nofollow sponsored noopener" className="relative mx-auto block w-full max-w-[300px]">
            <span className="absolute left-1 top-1 rounded bg-black/55 px-1 text-[9px] font-bold leading-[14px] text-white">広告</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.adImage.src} width={s.adImage.width} height={s.adImage.height} alt={s.adImage.alt} className="block h-auto w-full rounded-lg border border-slate-200" loading="lazy" />
          </a>
        ) : (
          <div className="mx-auto flex w-full max-w-[300px] flex-col items-center justify-center rounded-lg border border-[#f7c9d8] bg-[#fff6f9] px-4 py-6 text-center">
            <p className="text-[22px] font-black leading-tight text-slate-900">{s.name}</p>
            <p className="mt-1 text-[11px] text-slate-500">運営：{s.operator}</p>
          </div>
        )}

        {/* 1位だけ：数値のハイライト */}
        {s.highlights && (
          <dl className="mt-4 grid grid-cols-3 gap-1.5">
            {s.highlights.map((h) => (
              <div key={h.label} className="rounded-xl border border-[#f0d77a] bg-white px-1 py-2 text-center">
                <dt className="text-[10px] font-bold text-slate-500">{h.label}</dt>
                <dd className="mt-0.5 text-[15px] font-black leading-tight text-[#e8437a] min-[400px]:text-[17px]">
                  {h.value}
                  {h.note && <span className="align-top text-[9px] font-bold text-slate-400">{h.note}</span>}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {/* ③ CTA */}
        <div className="mt-4">
          <OfficialButton s={s} />
        </div>

        {/* ④ 基本情報／サポート内容 */}
        <div className="mt-5">
          <div role="tablist" aria-label={`${s.name}の情報の切り替え`} className="flex gap-1">
            {(
              [
                ["basic", "基本情報"],
                ["support", "サポート内容"],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                role="tab"
                id={`${uid}-tab-${k}`}
                aria-selected={tab === k}
                aria-controls={`${uid}-panel`}
                onClick={() => setTab(k)}
                className={`flex-1 rounded-t-lg py-2 text-[13px] font-black transition ${
                  tab === k ? "bg-[#e8437a] text-white" : "bg-[#fde3ec] text-[#c2386a] hover:bg-[#fbd3e1]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${tab}`} className="rounded-b-lg border-2 border-t-0 border-[#e8437a] bg-white">
            <table className="w-full border-collapse text-[13px]">
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.label} className={i > 0 ? "border-t border-[#f7d5e1]" : ""}>
                    <th scope="row" className="w-[40%] bg-[#fff6f9] px-2.5 py-2.5 text-left align-top text-[12px] font-bold text-[#c2386a]">
                      {r.label}
                    </th>
                    <td className="px-2.5 py-2.5 leading-snug text-slate-800">{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ⑤ おすすめポイント */}
        <section className="mt-5" aria-label="おすすめポイント">
          <h4 className="mb-2 flex items-center gap-1.5 text-[15px] font-black text-slate-900">
            <span className="h-4 w-1 rounded-full bg-[#e8437a]" aria-hidden="true" />
            おすすめポイント
          </h4>
          <ol className="space-y-2.5">
            {s.points.map((p, i) => (
              <li key={p} className="flex gap-2 rounded-xl bg-white px-3 py-2.5 text-[14px] leading-relaxed text-slate-700 shadow-[0_0_0_1px_#f7d5e1]">
                <CheckIcon />
                <span>
                  <span className="sr-only">ポイント{i + 1}：</span>
                  <Rich text={p} />
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* ⑥ こんな人におすすめ */}
        <section className="mt-5 rounded-xl border border-dashed border-[#f3a9c3] bg-[#fff6f9] px-3.5 py-3" aria-label="こんな人におすすめ">
          <h4 className="mb-1.5 text-[14px] font-black text-[#c2386a]">こんな人におすすめ</h4>
          <ul className="space-y-1">
            {s.recommendedFor.map((r) => (
              <li key={r} className="flex gap-1.5 text-[13px] leading-relaxed text-slate-700">
                <span className="text-[#e8437a]" aria-hidden="true">
                  ✓
                </span>
                {r}
              </li>
            ))}
          </ul>
        </section>

        {/* ⑦ CTA */}
        <div className="mt-5">
          <OfficialButton s={s} />
        </div>

        {/* ⑧ 出典・数値の注記 */}
        <div className="mt-4 space-y-0.5 text-[11px] leading-relaxed text-slate-500">
          {s.notes.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
