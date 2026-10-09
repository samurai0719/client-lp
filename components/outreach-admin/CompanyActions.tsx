"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CompanyRow } from "@/lib/outreach/companies";
import { ADMIN_BASE } from "@/lib/outreach/constants";

/** 企業詳細の操作パネル（目視確認・返信/契約の記録・送信停止・メモ） */
export default function CompanyActions({ company: c }: { company: CompanyRow }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState(c.notes ?? "");
  const [email, setEmail] = useState(c.email ?? "");

  async function patch(body: Record<string, unknown>, confirmText?: string) {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/adofy-admin/outreach/companies/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusy(false);
    if (!res.ok) {
      setError(((await res.json().catch(() => ({}))) as { error?: string }).error ?? "更新に失敗しました");
      return;
    }
    router.refresh();
  }

  async function remove() {
    if (!window.confirm("この企業を削除しますか？（送信履歴がある企業は削除できません）")) return;
    setBusy(true);
    const res = await fetch(`/api/adofy-admin/outreach/companies/${c.id}`, { method: "DELETE" });
    setBusy(false);
    if (!res.ok) {
      setError(((await res.json().catch(() => ({}))) as { error?: string }).error ?? "削除に失敗しました");
      return;
    }
    router.push(`${ADMIN_BASE}/companies`);
  }

  const btn = "w-full rounded-lg px-3 py-2.5 text-sm font-bold disabled:opacity-40";
  return (
    <aside className="space-y-3">
      <section className="rounded-xl border border-slate-200 bg-white p-3">
        <p className="mb-2 text-xs font-bold text-slate-500">目視確認</p>
        <div className="grid grid-cols-2 gap-2">
          <button disabled={busy || c.review_status === "approved"} onClick={() => patch({ review: "approved" })} className={`${btn} bg-emerald-600 text-white`}>
            送信OK
          </button>
          <button disabled={busy || c.review_status === "excluded"} onClick={() => patch({ review: "excluded" })} className={`${btn} border border-slate-300 text-slate-700`}>
            除外
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-3">
        <p className="mb-2 text-xs font-bold text-slate-500">営業の進捗を記録</p>
        <div className="space-y-2">
          <button disabled={busy || Boolean(c.replied_at)} onClick={() => patch({ action: "replied" })} className={`${btn} bg-violet-600 text-white`}>
            返信ありにする
          </button>
          {c.contracted_at ? (
            <button disabled={busy} onClick={() => patch({ action: "uncontracted" }, "契約の記録を取り消しますか？")} className={`${btn} border border-slate-300 text-slate-700`}>
              契約を取り消す
            </button>
          ) : (
            <button disabled={busy} onClick={() => patch({ action: "contracted" })} className={`${btn} bg-[#0a1f4e] text-white`}>
              契約にする
            </button>
          )}
          <button
            disabled={busy || Boolean(c.unsubscribed_at)}
            onClick={() => patch({ action: "unsubscribed" }, "このアドレスを配信停止リストに入れます。今後一斉送信の対象になりません。よろしいですか？")}
            className={`${btn} border border-amber-300 text-amber-800`}
          >
            送信拒否を受けた（配信停止）
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-3">
        <p className="mb-2 text-xs font-bold text-slate-500">送信先・メモ</p>
        <label className="block text-xs text-slate-500">
          メールアドレス（HPに掲載されている法人窓口のみ）
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-base sm:text-sm" />
        </label>
        <button disabled={busy || email === (c.email ?? "")} onClick={() => patch({ email })} className={`${btn} mt-2 border border-slate-300 text-slate-700`}>
          メールアドレスを保存
        </button>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="メモ"
          className="mt-3 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-base sm:text-sm"
        />
        <button disabled={busy || notes === (c.notes ?? "")} onClick={() => patch({ notes })} className={`${btn} mt-1 border border-slate-300 text-slate-700`}>
          メモを保存
        </button>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-3">
        <div className="space-y-2">
          <button disabled={busy} onClick={() => patch({ action: "recheck" })} className={`${btn} border border-slate-300 text-slate-700`}>
            {busy ? "処理中…" : "公式HPを再確認"}
          </button>
          <button
            disabled={busy}
            onClick={() => patch({ send_blocked: !c.send_blocked })}
            className={`${btn} border border-slate-300 text-slate-700`}
          >
            {c.send_blocked ? "送信停止を解除" : "この企業への送信を止める"}
          </button>
          <button disabled={busy} onClick={remove} className={`${btn} text-rose-600`}>
            削除
          </button>
        </div>
      </section>
      {error && <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-700">{error}</p>}
    </aside>
  );
}
