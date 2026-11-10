"use client";

import { useEffect, useRef } from "react";
import type { AnonymousProfile } from "@/lib/driverCandidates/profiles";

/**
 * 無料オンライン相談LPで、ブラウザの「戻る」を押したときに出すライトボックス。
 * 公開中の求職者プロフィール（/profiles と同じデータ）を数件見せて、申込みに戻ってもらう。
 * 料金（成果報酬の率など）はこのLPでは出さない方針なので、カードにも載せない。
 */

export type ExitProfilesData = { count: number; profiles: AnonymousProfile[] };

function Row({ k, v }: { k: string; v: string | null }) {
  if (!v) return null;
  return (
    <div className="flex gap-2 text-[12px] leading-snug">
      <dt className="w-[4.5em] shrink-0 font-bold text-slate-500">{k}</dt>
      <dd className="min-w-0 text-slate-700">{v}</dd>
    </div>
  );
}

function Card({ p }: { p: AnonymousProfile }) {
  const experience = p.experience ? p.experience.replace(/^ドライバー経験\s*/, "") : null;
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-sm font-black text-blue-800">候補者 No.{p.no}</p>
        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">連絡を待っています</span>
      </div>
      <div className="mb-2 grid grid-cols-3 gap-1.5 rounded-lg bg-blue-50 p-2 text-center">
        {[
          ["年齢", p.ageBand],
          ["希望勤務地", p.area],
          ["運転経験", experience],
        ].map(([k, v]) => (
          <div key={k} className="min-w-0">
            <p className="text-[10px] font-bold text-slate-500">{k}</p>
            <p className="truncate text-[12px] font-black text-slate-800">{v ?? "—"}</p>
          </div>
        ))}
      </div>
      {p.licenses.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-1" aria-label="保有免許">
          {p.licenses.map((l) => (
            <li key={l} className="rounded-full border border-blue-200 bg-white px-2 py-0.5 text-[10px] font-bold text-blue-700">
              {l}
            </li>
          ))}
        </ul>
      )}
      <dl className="flex flex-col gap-1">
        <Row k="希望年収" v={p.salaryBand} />
        <Row k="希望職種" v={p.jobTypes.join("・") || null} />
        <Row k="転職時期" v={p.changeTiming} />
      </dl>
    </article>
  );
}

export default function ExitProfiles({ data, onContinue, onLeave }: { data: ExitProfilesData; onContinue: () => void; onLeave: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // 開いている間は後ろのページをスクロールさせない。Esc で閉じる（申込みに戻る）
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onContinue();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onContinue]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-[2px] min-[520px]:items-center min-[520px]:p-4"
      onClick={(e) => e.target === e.currentTarget && onContinue()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-profiles-title"
        tabIndex={-1}
        className="flex max-h-[92dvh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-2xl bg-slate-50 shadow-2xl outline-none min-[520px]:rounded-2xl"
      >
        <div className="relative bg-gradient-to-r from-blue-800 to-blue-600 px-5 pb-4 pt-5 text-white">
          <button
            type="button"
            onClick={onContinue}
            aria-label="閉じる"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-lg leading-none hover:bg-white/25"
          >
            ×
          </button>
          <p className="text-[11px] font-bold tracking-wide text-blue-200">ちょっと待ってください</p>
          <h2 id="exit-profiles-title" className="mt-1 pr-8 text-[19px] font-black leading-snug">
            ドラテクに登録している
            <br />
            ドライバー求職者です
          </h2>
          {data.count > 0 && (
            <p className="mt-2 text-[13px] font-bold">
              いま <span className="text-xl text-amber-300">{data.count.toLocaleString("ja-JP")}</span> 人が連絡を待っています
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <p className="mb-3 text-center text-[11px] text-slate-500">氏名・連絡先など個人を特定できる情報は表示していません</p>
          <div className="flex flex-col gap-2.5">
            {data.profiles.map((p) => (
              <Card key={p.no} p={p} />
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          <button
            type="button"
            onClick={onContinue}
            className="w-full rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 py-4 text-[16px] font-black text-white shadow-[0_5px_0_#c2410c,0_8px_20px_rgba(234,88,12,0.3)] transition-all active:translate-y-[3px] active:shadow-[0_2px_0_#c2410c]"
          >
            無料オンライン相談の申込みに戻る
          </button>
          <button type="button" onClick={onLeave} className="mt-2 w-full py-2 text-xs text-slate-400 underline">
            このページを離れる
          </button>
        </div>
      </div>
    </div>
  );
}
