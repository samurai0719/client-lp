"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FEE_RATE } from "@/lib/driverCandidates/admin";

type Values = {
  outcome: string;
  hiredAt: string;
  joinedAt: string;
  annualSalary: string;
  feeAmount: string;
  invoicedAt: string;
  paidAt: string;
  billingMemo: string;
};

/**
 * 採用結果と成功報酬（請求・入金）の記録。企業へのメールは送らない。
 * 成功報酬は「想定年収 × 10%」を自動計算の目安として出し、金額は手で直せる。
 */
export default function OutcomeEditor({ id, initial, disabled }: { id: string; initial: Values; disabled?: string }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const set = (k: keyof Values, val: string) => setV((p) => ({ ...p, [k]: val }));

  const salary = Number(v.annualSalary.replace(/[,，円\s]/g, ""));
  const suggested = Number.isFinite(salary) && salary > 0 ? Math.round(salary * FEE_RATE) : null;

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/adofy-admin/scout-requests/${id}/outcome`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v.outcome === "hired" ? v : { ...v, hiredAt: "", joinedAt: "", annualSalary: "", feeAmount: "", invoicedAt: "", paidAt: "" }),
      });
      const data: { error?: string; candidateUpdated?: boolean } = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ ok: false, text: data.error ?? "保存に失敗しました" });
        return;
      }
      setMsg({ ok: true, text: data.candidateUpdated ? "保存しました。求職者を「就職決定」にしました。" : "保存しました。" });
      router.refresh();
    } catch {
      setMsg({ ok: false, text: "通信エラーで保存できませんでした" });
    } finally {
      setSaving(false);
    }
  };

  const input = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500";
  const label = "mb-1 block text-xs font-black text-slate-600";
  const hired = v.outcome === "hired";

  return (
    <section id="outcome" className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-black text-slate-700">採用結果・成功報酬</h2>
      {disabled && <p className="mb-3 rounded-lg bg-rose-50 p-2 text-xs text-rose-700">{disabled}</p>}
      <div className="grid gap-3">
        <div>
          <label className={label} htmlFor="oc">採用結果</label>
          <select id="oc" className={input} value={v.outcome} onChange={(e) => set("outcome", e.target.value)}>
            <option value="">未記録</option>
            <option value="hired">採用決定</option>
            <option value="not_hired">不採用・辞退</option>
          </select>
        </div>
        {hired && (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={label} htmlFor="ha">採用決定日</label>
                <input id="ha" type="date" className={input} value={v.hiredAt} onChange={(e) => set("hiredAt", e.target.value)} />
              </div>
              <div>
                <label className={label} htmlFor="ja">入社日</label>
                <input id="ja" type="date" className={input} value={v.joinedAt} onChange={(e) => set("joinedAt", e.target.value)} />
              </div>
              <div>
                <label className={label} htmlFor="as">想定年収（円）</label>
                <input
                  id="as"
                  inputMode="numeric"
                  className={input}
                  value={v.annualSalary}
                  onChange={(e) => {
                    // 成功報酬が空か、前の年収から自動計算した額のままなら、新しい年収の10%に合わせる
                    const next = Number(e.target.value.replace(/[,，円\s]/g, ""));
                    const nextFee = Number.isFinite(next) && next > 0 ? String(Math.round(next * FEE_RATE)) : "";
                    setV((p) => ({
                      ...p,
                      annualSalary: e.target.value,
                      feeAmount: p.feeAmount === "" || p.feeAmount === (suggested !== null ? String(suggested) : "") ? nextFee : p.feeAmount,
                    }));
                  }}
                  placeholder="4000000"
                />
              </div>
              <div>
                <label className={label} htmlFor="fa">成功報酬（円）</label>
                <input id="fa" inputMode="numeric" className={input} value={v.feeAmount} onChange={(e) => set("feeAmount", e.target.value)} />
                {suggested !== null && String(suggested) !== v.feeAmount && (
                  <button type="button" className="mt-1 text-xs font-bold text-blue-700 underline" onClick={() => set("feeAmount", String(suggested))}>
                    想定年収の{FEE_RATE * 100}%＝{suggested.toLocaleString("ja-JP")}円を入れる
                  </button>
                )}
              </div>
              <div>
                <label className={label} htmlFor="ia">請求日</label>
                <input id="ia" type="date" className={input} value={v.invoicedAt} onChange={(e) => set("invoicedAt", e.target.value)} />
              </div>
              <div>
                <label className={label} htmlFor="pa">入金日</label>
                <input id="pa" type="date" className={input} value={v.paidAt} onChange={(e) => set("paidAt", e.target.value)} />
              </div>
            </div>
          </>
        )}
        <div>
          <label className={label} htmlFor="bm">メモ（請求書番号・返金条件の扱いなど）</label>
          <textarea id="bm" rows={2} className={input} value={v.billingMemo} onChange={(e) => set("billingMemo", e.target.value)} />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={saving || Boolean(disabled)} className="rounded-lg bg-[#0a1f4e] px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50">
          {saving ? "保存中…" : "保存する"}
        </button>
        {msg && <p className={`text-sm font-bold ${msg.ok ? "text-emerald-700" : "text-rose-700"}`}>{msg.text}</p>}
      </div>
    </section>
  );
}
