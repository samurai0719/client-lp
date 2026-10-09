"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** 「HPなし」の企業を、会社名＋住所でのHP検索にもう一度かける */
export default function ResearchHpButton({ count, enabled }: { count: number; enabled: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  async function run() {
    setBusy(true);
    const res = await fetch("/api/adofy-admin/outreach/companies/research-hp", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    const j = (await res.json().catch(() => ({}))) as { count?: number; error?: string };
    setBusy(false);
    setMsg(res.ok ? `${j.count ?? 0}社をHP検索の待ちに入れました。自動処理で少しずつ進みます。` : (j.error ?? "失敗しました"));
    router.refresh();
  }
  return (
    <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
      <p className="font-bold text-slate-900">HPなしの企業をGoogleで再検索（{count.toLocaleString()}社）</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">
        gBizINFO にHPが登録されていない会社を、会社名＋所在地で Google Places から探します。社名と所在地が一致した場合だけ採用します。
        1社1回の検索で、月1,000回程度までは無料枠の範囲です。
      </p>
      <button
        type="button"
        disabled={!enabled || busy || count === 0}
        onClick={run}
        className="mt-3 rounded-lg bg-[#0a1f4e] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40"
      >
        {busy ? "処理中…" : "HPを再検索する"}
      </button>
      {!enabled && <p className="mt-2 text-xs font-bold text-amber-700">GOOGLE_PLACES_API_KEY を設定すると使えます</p>}
      {msg && <p className="mt-2 text-xs font-bold text-slate-700">{msg}</p>}
    </section>
  );
}
