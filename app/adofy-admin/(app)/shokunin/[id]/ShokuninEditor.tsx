"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SHOKUNIN_STATUSES, SHOKUNIN_STATUS_LABEL } from "@/lib/shokuninCandidates/admin";

/** 対応状況と運営メモの編集 */
export default function ShokuninEditor({ id, status, memo }: { id: string; status: string; memo: string }) {
  const router = useRouter();
  const [nextStatus, setNextStatus] = useState(status);
  const [adminMemo, setAdminMemo] = useState(memo);
  const [contactedNow, setContactedNow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function save() {
    setSaving(true);
    setMessage(null);
    const res = await fetch(`/api/adofy-admin/shokunin-candidates/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus, adminMemo, contactedNow }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setSaving(false);
    if (!res.ok) {
      setMessage({ ok: false, text: data.error ?? "保存に失敗しました" });
      return;
    }
    setContactedNow(false);
    setMessage({ ok: true, text: "保存しました" });
    router.refresh();
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
      <h2 className="mb-3 text-sm font-black text-slate-700">対応</h2>
      <label className="mb-3 block">
        <span className="mb-1 block font-bold text-slate-700">対応状況</span>
        <select value={nextStatus} onChange={(e) => setNextStatus(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2">
          {SHOKUNIN_STATUSES.map((s) => (
            <option key={s} value={s}>
              {SHOKUNIN_STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </label>
      <label className="mb-3 block">
        <span className="mb-1 block font-bold text-slate-700">運営メモ</span>
        <textarea value={adminMemo} onChange={(e) => setAdminMemo(e.target.value)} rows={7} maxLength={5000} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2" />
      </label>
      <label className="mb-3 flex items-center gap-2 text-slate-700">
        <input type="checkbox" checked={contactedNow} onChange={(e) => setContactedNow(e.target.checked)} />
        今連絡した（最終連絡日時を記録）
      </label>
      {message && <p className={`mb-2 font-bold ${message.ok ? "text-emerald-700" : "text-rose-700"}`}>{message.text}</p>}
      <button type="button" onClick={save} disabled={saving} className="w-full rounded-lg bg-[#0a1f4e] px-4 py-2.5 font-bold text-white disabled:opacity-60">
        {saving ? "保存中…" : "保存する"}
      </button>
    </section>
  );
}
