"use client";

import { useId, useState } from "react";
import { linkOf, type Service } from "@/config/nurse-ranking";
import { OfficialButton, RankBadge, Rich } from "./ui";
import { CheckIcon } from "./WorkStyleSection";
import SvgHeading from "@/components/nurse-shukyu3/SvgHeading";

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

export default function RankCard({
  s,
  href,
  ctaLabel,
  ctaSub,
  svgHeadings = false,
  ctaBig = false,
}: {
  s: Service;
  href?: string;
  ctaLabel?: string;
  ctaSub?: string;
  /** 見出し（h3・h4）をインラインSVGの文字で描く（週休3日LP用。ページに <SvgHeadingDefs /> が必要） */
  svgHeadings?: boolean;
  /** CTAボタンをひと回り大きくする */
  ctaBig?: boolean;
}) {
  const link = href ?? linkOf(s);
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
          {svgHeadings ? (
            <SvgHeading as="h3" id={`${uid}-title`} lines={[s.name]} size={21} align="left" variant="ribbon" className="mt-0.5" />
          ) : (
            <h3 id={`${uid}-title`} className="mt-1 text-[19px] font-black leading-tight [text-shadow:0_1px_2px_rgba(0,0,0,0.25)]">
              {s.name}
              {s.sub && <span className="ml-1.5 text-[11px] font-bold opacity-95">（{s.sub}）</span>}
            </h3>
          )}
        </div>
      </header>

      <div className="px-4 pb-5 pt-4">
        <p className="mb-3 text-center text-[15px] font-black leading-snug text-slate-900">
          <span className="bg-[linear-gradient(transparent_55%,#fff176_55%)]">{s.catchcopy}</span>
        </p>

        {/* ② 正規の広告素材。無いサービスはロゴを作らず文字で表示する */}
        {s.adImage ? (
          <a href={link} target="_blank" rel="nofollow sponsored noopener" className="relative mx-auto block w-full max-w-[300px]">
            <span className="absolute left-1 top-1 rounded bg-black/55 px-1 text-[9px] font-bold leading-[14px] text-white">広告</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.adImage.src} width={s.adImage.width} height={s.adImage.height} alt={s.adImage.alt} className="block h-auto w-full rounded-lg border border-slate-200" loading="lazy" />
          </a>
        ) : null}
        {s.adImage && <p className="mx-auto mt-1 max-w-[300px] text-[10px] leading-snug text-slate-400">※画像内の表記は{s.name}の広告素材によるものです。</p>}
        {!s.adImage && (
          <div className="mx-auto flex w-full max-w-[300px] flex-col items-center justify-center rounded-lg border border-[#f7c9d8] bg-white px-4 py-5 text-center">
            {s.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.logo.src} width={s.logo.width} height={s.logo.height} alt={s.name} className="h-auto max-h-[90px] w-full max-w-[220px] object-contain" />
            ) : (
              <p className="text-[22px] font-black leading-tight text-slate-900">{s.name}</p>
            )}
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
          <OfficialButton s={s} href={href} sub={ctaSub} big={ctaBig}>
            {ctaLabel}
          </OfficialButton>
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
          {svgHeadings ? (
            <SvgHeading as="h4" lines={["おすすめポイント"]} size={16} align="left" variant="sub" className="mb-1.5 border-l-4 border-[#e8437a] pl-2" />
          ) : (
            <h4 className="mb-2 flex items-center gap-1.5 text-[15px] font-black text-slate-900">
              <span className="h-4 w-1 rounded-full bg-[#e8437a]" aria-hidden="true" />
              おすすめポイント
            </h4>
          )}
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
          {svgHeadings ? (
            <SvgHeading as="h4" lines={["こんな人におすすめ"]} size={15} align="left" variant="sub" className="mb-1" />
          ) : (
            <h4 className="mb-1.5 text-[14px] font-black text-[#c2386a]">こんな人におすすめ</h4>
          )}
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

        {/* 口コミ（公式サイト掲載の利用者の声を原文のまま引用） */}
        {s.reviews.length > 0 && (
          <section className="mt-5" aria-label={`${s.name}の口コミ`}>
            {svgHeadings ? (
              <div className="mb-1.5 flex flex-wrap items-center gap-x-1.5 border-l-4 border-[#e8437a] pl-2">
                <SvgHeading as="h4" lines={[`${s.name}の口コミ`]} size={16} align="left" variant="sub" />
                <span className="text-[11px] font-bold text-slate-500">（公式サイト掲載）</span>
              </div>
            ) : (
              <h4 className="mb-2 flex items-center gap-1.5 text-[15px] font-black text-slate-900">
                <span className="h-4 w-1 rounded-full bg-[#e8437a]" aria-hidden="true" />
                {s.name}の口コミ
                <span className="text-[11px] font-bold text-slate-500">（公式サイト掲載）</span>
              </h4>
            )}
            <ul className="space-y-2.5">
              {s.reviews.map((r) => (
                <li key={r.profile} className="flex gap-2.5">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fde3ec] text-[#e8437a]" aria-hidden="true">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20.5c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5z" />
                    </svg>
                  </span>
                  <figure className="relative min-w-0 flex-1 rounded-xl border border-[#f7d5e1] bg-white px-3 py-2.5 before:absolute before:-left-[6px] before:top-3.5 before:h-3 before:w-3 before:rotate-45 before:border-b before:border-l before:border-[#f7d5e1] before:bg-white">
                    <figcaption className="relative text-[11px] font-bold text-[#c2386a]">{r.profile}</figcaption>
                    <blockquote cite={s.reviewSource.url} className="relative mt-1 text-[13px] leading-relaxed text-slate-700">
                      「{r.text}」
                    </blockquote>
                    {r.detail && <p className="relative mt-1.5 rounded bg-[#fff6f9] px-2 py-1 text-[11px] leading-snug text-slate-600">{r.detail}</p>}
                  </figure>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
              出典：
              <a href={s.reviewSource.url} target="_blank" rel="noopener" className="text-[#2a6fd6] underline underline-offset-2">
                {s.reviewSource.label}
              </a>
              （2026年11月15日確認）。{s.reviewSource.note}
            </p>
          </section>
        )}

        {/* ⑦ CTA */}
        <div className="mt-5">
          <OfficialButton s={s} href={href} sub={ctaSub} big={ctaBig}>
            {ctaLabel}
          </OfficialButton>
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
