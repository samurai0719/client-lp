"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NOTIFY_STATUSES, REQUEST_STATUSES, STATUS_LABEL, type RequestStatus } from "@/lib/driverScout/requests";

type Initial = {
  status: RequestStatus;
  candidateAnswers: string;
  candidateAvailableTimes: string;
  companyAvailableTimes: string;
  interviewAt: string | null;
  interviewPlace: string;
  staffMemo: string;
  contracted: boolean;
  notifiedStatus: string | null;
};

/** ISO → <input type="datetime-local"> の値（日本時間） */
function toLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(new Date(iso).getTime() + 9 * 3600 * 1000);
  return d.toISOString().slice(0, 16);
}
/** <input type="datetime-local">（日本時間）→ ISO */
function fromLocal(v: string): string | null {
  return v ? new Date(`${v}:00+09:00`).toISOString() : null;
}

/**
 * 運営の対応記録。求職者の回答（企業へ伝える内容）と、運営メモ（企業には見せない）は別の欄。
 * 人物評価・推薦コメントの欄は設けない。
 */
export default function RequestEditor({ id, initial, hasCompany }: { id: string; initial: Initial; hasCompany: boolean }) {
  const router = useRouter();
  const [v, setV] = useState({ ...initial, interviewAt: toLocal(initial.interviewAt) });
  const [notify, setNotify] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => setV((p) => ({ ...p, [k]: val }));

  const willNotify = notify && NOTIFY_STATUSES.includes(v.status) && initial.notifiedStatus !== v.status;

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/adofy-admin/scout-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: v.status,
          candidateAnswers: v.candidateAnswers,
          candidateAvailableTimes: v.candidateAvailableTimes,
          companyAvailableTimes: v.companyAvailableTimes,
          interviewAt: fromLocal(v.interviewAt),
          interviewPlace: v.interviewPlace,
          staffMemo: v.staffMemo,
          ...(hasCompany && v.contracted !== initial.contracted ? { contracted: v.contracted } : {}),
          notify,
        }),
      });
      const data: { error?: string; mailed?: boolean | null } = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ ok: false, text: data.error ?? "保存に失敗しました" });
        return;
      }
      setMsg({
        ok: true,
        text:
          data.mailed === true
            ? "保存し、企業へメールで知らせました。"
            : data.mailed === false
              ? "保存しました。企業へのメールは送れませんでした（RESEND_API_KEY などの設定をご確認ください）。"
              : "保存しました。",
      });
      router.refresh();
    } catch {
      setMsg({ ok: false, text: "通信エラーで保存できませんでした" });
    } finally {
      setSaving(false);
    }
  };

  const input = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500";
  const label = "mb-1 block text-xs font-black text-slate-600";

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="mb-3 text-sm font-black text-slate-700">運営の対応</h2>
      <div className="grid gap-3">
        <div>
          <label className={label} htmlFor="st">対応状況</label>
          <select id="st" className={input} value={v.status} onChange={(e) => set("status", e.target.value as RequestStatus)}>
            {REQUEST_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="ans">求職者の回答（企業の受付状況ページに表示されます）</label>
          <textarea id="ans" rows={4} className={input} value={v.candidateAnswers} onChange={(e) => set("candidateAnswers", e.target.value)} placeholder="確認事項への回答を、本人の言葉に沿って記録します（評価や推薦は書かない）" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="cat">求職者の面接可能日時</label>
            <textarea id="cat" rows={2} className={input} value={v.candidateAvailableTimes} onChange={(e) => set("candidateAvailableTimes", e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="coat">企業の面接可能日時</label>
            <textarea id="coat" rows={2} className={input} value={v.companyAvailableTimes} onChange={(e) => set("companyAvailableTimes", e.target.value)} />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="iat">確定した面接日時（日本時間）</label>
            <input id="iat" type="datetime-local" className={input} value={v.interviewAt} onChange={(e) => set("interviewAt", e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="ipl">面接の場所・方法</label>
            <input id="ipl" className={input} value={v.interviewPlace} onChange={(e) => set("interviewPlace", e.target.value)} placeholder="例）本社（名古屋市港区…）／オンライン" />
          </div>
        </div>
        <div>
          <label className={label} htmlFor="memo">運営メモ（企業には表示しません）</label>
          <textarea id="memo" rows={3} className={input} value={v.staffMemo} onChange={(e) => set("staffMemo", e.target.value)} placeholder="連絡した日時・つながらなかった回数など" />
        </div>
        {hasCompany && (
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <input type="checkbox" checked={v.contracted} onChange={(e) => set("contracted", e.target.checked)} />
            この企業は契約済み（以後の依頼で契約手続きを案内しない）
          </label>
        )}
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
          対応状況が「日程調整中・面接確定・面接見送り・連絡がつかない」に変わったら、企業へメールで知らせる
        </label>
        {willNotify && <p className="rounded-lg bg-amber-50 p-2 text-xs font-bold text-amber-800">保存すると、企業へ「{STATUS_LABEL[v.status]}」のお知らせメールを送ります。</p>}
        <button type="button" onClick={save} disabled={saving} className="rounded-lg bg-[#0a1f4e] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">
          {saving ? "保存しています…" : "保存する"}
        </button>
        {msg && <p className={`text-sm font-bold ${msg.ok ? "text-emerald-700" : "text-rose-700"}`}>{msg.text}</p>}
      </div>
    </section>
  );
}
