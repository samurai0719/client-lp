"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PREFECTURES } from "@/lib/types/driverCompanyInquiry";
import {
  AGE_BANDS,
  CANDIDATE_JOB_TYPES,
  CANDIDATE_LICENSES,
  CANDIDATE_STATUSES,
  CANDIDATE_STATUS_LABEL,
  CHANGE_TIMINGS,
  type CandidateValues,
} from "@/lib/driverCandidates/admin";

const EMPTY: CandidateValues = {
  status: "pending",
  fullName: "",
  phone: "",
  email: "",
  currentEmployer: "",
  ageBand: "",
  desiredPrefecture: "",
  desiredArea: "",
  desiredSalaryBand: "",
  licenses: [],
  experience: "",
  desiredJobTypes: [],
  changeTiming: "",
  staffMemo: "",
};

/** 選択肢に、いま入っている値（旧LPの回答など選択肢に無いもの）を足す */
function withCurrent(options: readonly string[], current: string[]): string[] {
  return [...options, ...current.filter((c) => !options.includes(c))];
}

/**
 * 求職者の登録・編集。上段は企業に見せる匿名プロフィール、下段は運営だけが見る個人情報。
 * 「公開中」にすると企業向けの求職者一覧（scout）に匿名で載る。
 */
export default function CandidateForm({ id, initial }: { id?: string; initial?: CandidateValues }) {
  const router = useRouter();
  const [v, setV] = useState<CandidateValues>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const set = <K extends keyof CandidateValues>(k: K, val: CandidateValues[K]) => setV((p) => ({ ...p, [k]: val }));
  const toggle = (k: "licenses" | "desiredJobTypes", item: string) =>
    setV((p) => ({ ...p, [k]: p[k].includes(item) ? p[k].filter((x) => x !== item) : [...p[k], item] }));

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(id ? `/api/adofy-admin/driver-candidates/${id}` : "/api/adofy-admin/driver-candidates", {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });
      const data: { error?: string; id?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ ok: false, text: data.error ?? "保存に失敗しました" });
        return;
      }
      if (!id && data.id) {
        router.push(`/adofy-admin/doratech/candidates/${data.id}`);
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
  const label = "mb-1 block text-xs font-black text-slate-600";
  const chip = (on: boolean) =>
    `rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${on ? "bg-[#0a1f4e] text-white ring-[#0a1f4e]" : "bg-white text-slate-600 ring-slate-300"}`;

  return (
    <div className="grid gap-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <label className={label} htmlFor="status">状態</label>
        <select id="status" className={input} value={v.status} onChange={(e) => set("status", e.target.value as CandidateValues["status"])}>
          {CANDIDATE_STATUSES.map((s) => (
            <option key={s} value={s}>{CANDIDATE_STATUS_LABEL[s]}</option>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-slate-500">
          「公開中」にすると、企業向けの求職者一覧に匿名プロフィールが載ります。本人に公開の了承を取ってから切り替えてください。
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-black text-slate-700">匿名プロフィール（企業に見せる情報）</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="age">年代</label>
            <select id="age" className={input} value={v.ageBand} onChange={(e) => set("ageBand", e.target.value)}>
              <option value="">未選択</option>
              {AGE_BANDS.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="timing">転職希望時期</label>
            <select id="timing" className={input} value={v.changeTiming} onChange={(e) => set("changeTiming", e.target.value)}>
              <option value="">未選択</option>
              {CHANGE_TIMINGS.map((a) => <option key={a}>{a}</option>)}
              {v.changeTiming && !(CHANGE_TIMINGS as readonly string[]).includes(v.changeTiming) && <option>{v.changeTiming}</option>}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="pref">希望勤務地（都道府県）</label>
            <select id="pref" className={input} value={v.desiredPrefecture} onChange={(e) => set("desiredPrefecture", e.target.value)}>
              <option value="">未選択</option>
              {PREFECTURES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="area">希望エリア（任意）</label>
            <input id="area" className={input} value={v.desiredArea} onChange={(e) => set("desiredArea", e.target.value)} placeholder="例：尾張エリア" />
          </div>
          <div>
            <label className={label} htmlFor="salary">希望年収</label>
            <input id="salary" className={input} value={v.desiredSalaryBand} onChange={(e) => set("desiredSalaryBand", e.target.value)} placeholder="例：450万〜500万円" />
          </div>
          <div>
            <label className={label} htmlFor="exp">経験</label>
            <input id="exp" className={input} value={v.experience} onChange={(e) => set("experience", e.target.value)} placeholder="例：大型トラック 5年" />
          </div>
        </div>
        <p className={`${label} mt-3`}>免許</p>
        <div className="flex flex-wrap gap-1.5">
          {withCurrent(CANDIDATE_LICENSES, v.licenses).map((l) => (
            <button key={l} type="button" className={chip(v.licenses.includes(l))} onClick={() => toggle("licenses", l)}>{l}</button>
          ))}
        </div>
        <p className={`${label} mt-3`}>希望の仕事</p>
        <div className="flex flex-wrap gap-1.5">
          {withCurrent(CANDIDATE_JOB_TYPES, v.desiredJobTypes).map((l) => (
            <button key={l} type="button" className={chip(v.desiredJobTypes.includes(l))} onClick={() => toggle("desiredJobTypes", l)}>{l}</button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-black text-slate-700">個人情報（運営だけが見る。企業には出さない）</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="name">氏名</label>
            <input id="name" className={input} value={v.fullName} onChange={(e) => set("fullName", e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="phone">電話番号</label>
            <input id="phone" className={input} inputMode="tel" value={v.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="email">メール</label>
            <input id="email" className={input} inputMode="email" value={v.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="emp">現在の勤務先</label>
            <input id="emp" className={input} value={v.currentEmployer} onChange={(e) => set("currentEmployer", e.target.value)} />
          </div>
        </div>
        <label className={`${label} mt-3`} htmlFor="memo">運営メモ</label>
        <textarea id="memo" rows={4} className={input} value={v.staffMemo} onChange={(e) => set("staffMemo", e.target.value)} placeholder="電話した日時、本人の希望、公開の了承を取った日など" />
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={saving} className="rounded-lg bg-[#0a1f4e] px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50">
          {saving ? "保存中…" : id ? "保存する" : "登録する"}
        </button>
        {msg && <p className={`text-sm font-bold ${msg.ok ? "text-emerald-700" : "text-rose-700"}`}>{msg.text}</p>}
      </div>
    </div>
  );
}
