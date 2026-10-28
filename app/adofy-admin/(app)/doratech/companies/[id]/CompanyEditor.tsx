"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COMPANY_STATUSES, COMPANY_STATUS_LABEL, type CompanyStatus } from "@/lib/driverCandidates/admin";

/** 企業の対応状況・契約・運営メモ */
export default function CompanyEditor({ id, initial }: { id: string; initial: { status: CompanyStatus; contracted: boolean; staffMemo: string } }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/adofy-admin/driver-company-inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ ok: false, text: data.error ?? "保存に失敗しました" });
        return;
      }
      setMsg({ ok: true, text: "保存しました。" });
      router.refresh();
    } catch {
      setMsg({ ok: false, text: "通信エラーで保存できませんでした" });
    } finally {
      setSaving(false);
    }
  };

  const input = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500";
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-black text-slate-700">運営の対応</h2>
      <label className="mb-1 block text-xs font-black text-slate-600" htmlFor="cst">対応状況</label>
      <select id="cst" className={input} value={v.status} onChange={(e) => setV({ ...v, status: e.target.value as CompanyStatus })}>
        {COMPANY_STATUSES.map((s) => <option key={s} value={s}>{COMPANY_STATUS_LABEL[s]}</option>)}
      </select>
      <label className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-800">
        <input type="checkbox" checked={v.contracted} onChange={(e) => setV({ ...v, contracted: e.target.checked })} />
        契約済み（面接希望のたびに契約手続きを案内しない）
      </label>
      <label className="mb-1 mt-3 block text-xs font-black text-slate-600" htmlFor="cmemo">運営メモ</label>
      <textarea id="cmemo" rows={5} className={input} value={v.staffMemo} onChange={(e) => setV({ ...v, staffMemo: e.target.value })} placeholder="契約書を送った日、請求先、やりとりの記録など" />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={saving} className="rounded-lg bg-[#0a1f4e] px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50">
          {saving ? "保存中…" : "保存する"}
        </button>
        {msg && <p className={`text-sm font-bold ${msg.ok ? "text-emerald-700" : "text-rose-700"}`}>{msg.text}</p>}
      </div>
    </section>
  );
}
