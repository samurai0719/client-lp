"use client";

import { useState } from "react";
import { workStyles } from "@/config/nurse-ranking";
import { Rich, SectionTitle } from "./ui";

/**
 * 「どんな働き方を希望していますか？」
 * 選んだ働き方について、転職相談のときに確認したいポイントを出す（求人検索・求人件数の表示ではない）。
 */
export default function WorkStyleSection() {
  const [active, setActive] = useState(workStyles[0].id);
  const current = workStyles.find((w) => w.id === active) ?? workStyles[0];

  return (
    <section aria-labelledby="workstyle-title" className="px-4 py-8">
      <SectionTitle
        id="workstyle-title"
        lines={["週休3日とあわせて", "どんな働き方を希望しますか？"]}
        highlight={["働き方"]}
        sub="選ぶと、転職相談のときに確認したいポイントが表示されます"
      />
      <div className="grid grid-cols-2 gap-2 min-[640px]:grid-cols-4" role="group" aria-label="希望する働き方">
        {workStyles.map((w) => {
          const on = w.id === active;
          return (
            <button
              key={w.id}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(w.id)}
              className={`min-h-[48px] rounded-full border-2 px-3 py-2 text-[14px] font-black transition ${
                on ? "border-[#e8437a] bg-[#e8437a] text-white shadow-[0_3px_0_#b8305f]" : "border-[#f3a9c3] bg-white text-[#c2386a] hover:bg-[#fff1f5]"
              }`}
            >
              {w.label}
            </button>
          );
        })}
      </div>
      <div className="mt-4 rounded-2xl border border-[#f7c9d8] bg-[#fff6f9] p-4" aria-live="polite">
        <p className="text-[13px] leading-relaxed text-slate-700">
          <b className="text-[#c2386a]">「{current.label}」</b>を希望する場合 ― {current.lead}
        </p>
        <ul className="mt-3 space-y-2">
          {current.points.map((p) => (
            <li key={p} className="flex gap-2 text-[14px] leading-relaxed text-slate-700">
              <CheckIcon />
              <span>
                <Rich text={p} />
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-slate-500">※ 求人の有無や条件は時期・地域によって異なります。上記は相談時に確認したい項目の例です。</p>
      </div>
    </section>
  );
}

export function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" className="mt-[3px] h-[18px] w-[18px] shrink-0" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="#e8437a" />
      <path d="M5.5 10.3l3 3 6-6.3" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
