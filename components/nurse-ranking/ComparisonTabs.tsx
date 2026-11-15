"use client";

import { useId, useState } from "react";
import { services, type Service } from "@/config/nurse-ranking";
import { OfficialButton, ServiceName } from "./ui";

/**
 * タブ付き比較表（サービスを縦に並べる形式）。上部と下部の2か所で使い、タブはそれぞれ独立して動く。
 *   総合比較     … サービス名・順位／主な特徴／対応エリア／公式サイト
 *   サポート比較 … サービス名・順位／相談方法／転職サポート／公式サイト
 * 1位の行は金色の枠と淡い黄色の背景で目立たせる。
 */

type TabKey = "overall" | "support";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overall", label: "総合比較" },
  { key: "support", label: "サポート比較" },
];

const COLUMNS: Record<TabKey, { head: [string, string]; cells: (s: Service) => [string, string] }> = {
  overall: { head: ["主な特徴", "対応\nエリア"], cells: (s) => [s.feature, s.area] },
  support: { head: ["相談\n方法", "転職サポート"], cells: (s) => [s.consult, s.support] },
};

export default function ComparisonTabs({ caption }: { caption: string }) {
  const [tab, setTab] = useState<TabKey>("overall");
  const uid = useId();
  const col = COLUMNS[tab];

  return (
    <div>
      <div role="tablist" aria-label={`${caption}の切り替え`} className="flex gap-1.5">
        {TABS.map((t) => {
          const active = t.key === tab;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              id={`${uid}-tab-${t.key}`}
              aria-selected={active}
              aria-controls={`${uid}-panel`}
              onClick={() => setTab(t.key)}
              className={`flex-1 rounded-t-xl px-2 py-2.5 text-[14px] font-black transition ${
                active ? "bg-[#e8437a] text-white" : "bg-[#fde3ec] text-[#c2386a] hover:bg-[#fbd3e1]"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${tab}`} className="overflow-x-auto rounded-b-xl border-2 border-t-0 border-[#e8437a] bg-white">
        <table className="w-full min-w-[340px] border-collapse text-left">
          <caption className="sr-only">{caption}（{TABS.find((t) => t.key === tab)?.label}）</caption>
          <thead>
            <tr className="bg-[#fff1f5] text-[11px] font-bold leading-tight text-[#c2386a]">
              <th scope="col" className="w-[98px] whitespace-nowrap px-1 py-2 text-center min-[400px]:w-[104px]">
                サービス
              </th>
              <th scope="col" className="px-2 py-2 text-center">
                <span className="whitespace-pre-line">{col.head[0]}</span>
              </th>
              <th scope="col" className={`px-1 py-2 text-center ${tab === "overall" ? "w-[46px]" : ""}`}>
                <span className="whitespace-pre-line">{col.head[1]}</span>
              </th>
              <th scope="col" className="w-[58px] px-1 py-2 text-center">
                公式<br />サイト
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => {
              const [a, b] = col.cells(s);
              const first = s.rank === 1;
              return (
                <tr
                  key={s.id}
                  className={first ? "bg-[#fffbe6] outline outline-[3px] -outline-offset-[3px] outline-[#e7b416]" : "border-t border-[#f7d5e1]"}
                >
                  <th scope="row" className="px-1 py-3 align-middle font-normal">
                    {first && (
                      <span className="mb-1 block rounded-sm bg-[#e7b416] px-1 py-0.5 text-center text-[10px] font-black leading-none text-white">
                        おすすめ
                      </span>
                    )}
                    <ServiceName s={s} compact />
                  </th>
                  <td className="px-2 py-3 align-middle text-[12px] leading-snug text-slate-700 min-[400px]:text-[13px]">
                    {first && tab === "overall" ? <b className="font-bold text-slate-900">{a}</b> : a}
                  </td>
                  <td className={`py-3 align-middle text-[12px] leading-snug text-slate-700 min-[400px]:text-[13px] ${tab === "overall" ? "px-1 text-center font-bold" : "px-2"}`}>
                    {b}
                  </td>
                  <td className="px-1 py-3 align-middle">
                    <OfficialButton s={s} size="sm" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
