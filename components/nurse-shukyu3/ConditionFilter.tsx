"use client";

import { useMemo, useState } from "react";
import { PREFECTURES } from "@/lib/types/driverCompanyInquiry";
import { shukyu3Services as services } from "@/config/nurse-ranking";
import { CTA_LABEL, SHUKYU3_LINKS, jobCheckPoints, qualificationFilters, workStyleFilters } from "@/config/nurse-shukyu3";
import { OfficialButton, RankBadge } from "@/components/nurse-ranking/ui";

/**
 * ⑤ こだわり条件から比較。
 * 希望勤務地・資格・勤務形態を選ぶと、各社の公式サイトの検索条件（対応エリア・求人職種・勤務形態）に
 * 照らして該当するサービスを絞り込む。週休3日の条件別データは無いので、結果の下に相談時の確認ポイントを出す。
 */
export default function ConditionFilter() {
  const [pref, setPref] = useState("");
  const [qual, setQual] = useState("");
  const [style, setStyle] = useState("");
  const [searched, setSearched] = useState(false);

  const results = useMemo(() => {
    const f = workStyleFilters.find((w) => w.id === style);
    return services.map((s) => {
      const areaOk = s.area === "全国"; // 3社とも全国の求人を掲載（公式サイトの都道府県検索で確認）
      const qualOk = !qual || (s.jobTypes as readonly string[]).includes(qual);
      const matched = f ? s.workTypes.filter((w) => f.match.includes(w.kind)) : [];
      const styleOk = !f || matched.length > 0;
      return { s, ok: areaOk && qualOk && styleOk, matched };
    });
  }, [qual, style]);

  const hits = results.filter((r) => r.ok);
  const styleLabel = workStyleFilters.find((w) => w.id === style)?.label;

  const select = "w-full appearance-none rounded-xl border-2 border-[#f3a9c3] bg-white px-3 py-3 pr-8 text-[15px] font-bold text-slate-800 outline-none focus:border-[#e8437a] focus:ring-4 focus:ring-[#fde3ec]";

  return (
    <div>
      <form
        className="rounded-2xl border-2 border-[#f7c9d8] bg-[#fff6f9] p-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSearched(true);
          requestAnimationFrame(() => document.getElementById("filter-result")?.scrollIntoView({ behavior: "smooth", block: "start" }));
        }}
      >
        <div className="grid gap-3 min-[640px]:grid-cols-3">
          {[
            { id: "f-pref", label: "希望勤務地", value: pref, set: setPref, options: PREFECTURES as readonly string[], placeholder: "都道府県を選ぶ" },
            { id: "f-qual", label: "資格", value: qual, set: setQual, options: qualificationFilters as readonly string[], placeholder: "資格を選ぶ" },
            { id: "f-style", label: "勤務形態", value: style, set: setStyle, options: workStyleFilters.map((w) => w.id), placeholder: "勤務形態を選ぶ" },
          ].map((f) => (
            <label key={f.id} htmlFor={f.id} className="block">
              <span className="mb-1 block text-[13px] font-black text-[#c2386a]">{f.label}</span>
              <span className="relative block">
                <select id={f.id} value={f.value} onChange={(e) => { f.set(e.target.value); setSearched(false); }} className={select}>
                  <option value="">{f.placeholder}</option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {f.id === "f-style" ? workStyleFilters.find((w) => w.id === o)?.label : o}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#e8437a]" aria-hidden="true">
                  ▾
                </span>
              </span>
            </label>
          ))}
        </div>
        <button
          type="submit"
          className="mt-4 flex min-h-[52px] w-full items-center justify-center rounded-full bg-gradient-to-b from-[#f06a99] to-[#e8437a] text-[16px] font-black text-white shadow-[0_4px_0_#b8305f] transition active:translate-y-[3px] active:shadow-[0_1px_0_#b8305f]"
        >
          この条件で比較する
        </button>
      </form>

      {searched && (
        <div id="filter-result" className="mt-5 scroll-mt-4" aria-live="polite">
          <p className="mb-3 text-center text-[14px] font-black text-slate-900">
            {[pref, qual, styleLabel].filter(Boolean).join("・") || "条件指定なし"} で探せるサービス：
            <span className="ml-1 text-[20px] text-[#e8437a]">{hits.length}</span>社
          </p>
          <ul className="space-y-3">
            {results.map(({ s, ok, matched }) => (
              <li
                key={s.id}
                className={`rounded-2xl border-2 p-3.5 ${ok ? (s.rank === 1 ? "border-[#e7b416] bg-[#fffbe6]" : "border-[#f3c6d6] bg-white") : "border-slate-200 bg-slate-50 opacity-70"}`}
              >
                <div className="flex items-center gap-2.5">
                  <RankBadge rank={s.rank} />
                  <p className="min-w-0 flex-1 text-[16px] font-black text-slate-900">{s.name}</p>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black ${ok ? "bg-[#e8437a] text-white" : "bg-slate-300 text-slate-600"}`}>
                    {ok ? "条件で探せる" : "条件に該当なし"}
                  </span>
                </div>
                <ul className="mt-2 space-y-0.5 text-[12px] leading-relaxed text-slate-600">
                  <li>・勤務地：{pref ? `${pref}を含む` : ""}全国の求人を掲載</li>
                  {qual && <li>・資格：{(s.jobTypes as readonly string[]).includes(qual) ? `${qual}の求人あり` : `${qual}の検索条件なし`}</li>}
                  {style && <li>・勤務形態：{matched.length ? `公式サイトの検索条件「${matched.map((m) => m.label).join("・")}」` : "該当する検索条件なし"}</li>}
                </ul>
                {ok && (
                  <div className="mt-3">
                    <OfficialButton s={s} href={SHUKYU3_LINKS[s.id]} sub="＼ 休日の希望も伝えられる ／">
                      {CTA_LABEL}
                    </OfficialButton>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
            ※各社公式サイトの対応エリア・求人検索条件（2026年11月15日確認）をもとに表示しています。条件に合う求人が今あるかどうかは、地域・募集状況によって異なります。
          </p>

          <div className="mt-5 rounded-2xl border border-[#f7c9d8] bg-white p-4">
            <p className="text-[14px] font-black text-[#c2386a]">週休3日を希望するなら、相談時にここを確認</p>
            <p className="mt-1 text-[12px] text-slate-500">週休3日の求人の有無は条件別のデータがないため、担当者に次の点を確認しましょう。</p>
            <ol className="mt-2.5 space-y-1.5">
              {jobCheckPoints.map((c, i) => (
                <li key={c.title} className="flex gap-2 text-[13px] leading-snug text-slate-700">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e8437a] text-[11px] font-black text-white">{i + 1}</span>
                  {c.title}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
