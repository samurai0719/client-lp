"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle, ArrowLeft, Check, FileText, Mail, MessageSquare,
  Phone, Trash2, Users,
} from "lucide-react";
import {
  CONSULTATION_LABELS as L, STATUS_LABELS, STATUS_STYLES,
  formatDateTime, mapAll, mapOne, type Consultation,
} from "../../_lib/labels";

type Activity = {
  id: string;
  activity_type: string;
  content: string;
  created_at: string;
};

/** 記録の種類。ボタンで選ぶ */
const ACTIVITY_TYPES = [
  { value: "call", label: "電話した", icon: Phone },
  { value: "email", label: "メール送信", icon: Mail },
  { value: "meeting", label: "打ち合わせ", icon: Users },
  { value: "quote", label: "見積送付", icon: FileText },
  { value: "note", label: "メモ", icon: MessageSquare },
] as const;

const TYPE_META: Record<string, { label: string; cls: string }> = {
  call: { label: "電話", cls: "bg-blue-100 text-blue-800" },
  email: { label: "メール", cls: "bg-violet-100 text-violet-800" },
  meeting: { label: "打ち合わせ", cls: "bg-emerald-100 text-emerald-800" },
  quote: { label: "見積", cls: "bg-amber-100 text-amber-800" },
  note: { label: "メモ", cls: "bg-slate-100 text-slate-700" },
  status: { label: "状態変更", cls: "bg-slate-100 text-slate-500" },
};

export default function ConsultationDetail({
  initial,
  initialActivities,
}: {
  initial: Consultation;
  initialActivities: Activity[];
}) {
  const id = initial.id;
  const [row, setRow] = useState<Consultation>(initial);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [error, setError] = useState("");

  const [type, setType] = useState<string>("call");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const changeStatus = async (status: string) => {
    const prev = row.status;
    if (prev === status) return;

    // 先に画面へ反映し、失敗したら戻す
    setRow({ ...row, status });
    setError("");

    const res = await fetch(`/api/adofy-admin/consultations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      setRow({ ...row, status: prev });
      setError("ステータスの更新に失敗しました");
      return;
    }

    // 変更履歴はAPIが作るので、返ってきたものをそのまま先頭に足す
    const j = await res.json().catch(() => ({}));
    if (j.activity) setActivities((a) => [j.activity, ...a]);
  };

  const addActivity = async () => {
    const text = content.trim();
    if (!text || saving) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/adofy-admin/consultations/${id}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, content: text }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? "保存に失敗しました");
        return;
      }
      const j = await res.json();
      setActivities((a) => [j.activity, ...a]);
      setContent("");
    } catch {
      setError("通信エラーで保存できませんでした");
    } finally {
      setSaving(false);
    }
  };

  const removeActivity = async (activityId: string) => {
    if (!confirm("この記録を削除しますか？")) return;
    const prev = activities;
    setActivities((a) => a.filter((x) => x.id !== activityId));
    const res = await fetch(
      `/api/adofy-admin/consultations/${id}/activities?activityId=${activityId}`,
      { method: "DELETE" }
    );
    if (!res.ok) {
      setActivities(prev);
      setError("削除に失敗しました");
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <Link
        href="/adofy-admin/consultations"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        相談一覧へ戻る
      </Link>

      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">{row.company_name}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {row.contact_name}
          {row.position ? `（${row.position}）` : ""} ／ {row.prefecture}
          {row.city ?? ""} ／ 受付 {formatDateTime(row.created_at)}
        </p>
      </div>

      {error && (
        <p className="mb-4 flex items-center gap-2 rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4 flex-none" />
          {error}
        </p>
      )}

      {/* ステータス */}
      <div className="mb-6">
        <p className="mb-2 text-xs font-bold text-slate-500">対応状況</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(STATUS_LABELS).map(([v, label]) => {
            const on = row.status === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => changeStatus(v)}
                aria-pressed={on}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-bold transition ${
                  on ? STATUS_STYLES[v] : "border-slate-200 bg-white text-slate-500 hover:border-slate-400"
                }`}
              >
                {on && <Check className="h-3.5 w-3.5" />}
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        {/* 相談内容 */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <h2 className="mb-4 text-sm font-bold text-slate-900">相談内容</h2>
          <dl className="grid gap-3 text-sm">
            <Row label="事業形態" value={mapOne(L.business, row.business_type)} />
            <Row
              label="電話"
              value={
                row.phone ? (
                  <a className="font-bold text-blue-700 underline" href={`tel:${row.phone}`}>
                    {row.phone}
                  </a>
                ) : "—"
              }
            />
            <Row
              label="メール"
              value={
                row.email ? (
                  <a className="font-bold text-blue-700 underline" href={`mailto:${row.email}`}>
                    {row.email}
                  </a>
                ) : "—"
              }
            />
            <Row
              label="希望連絡方法"
              value={`${mapOne(L.method, row.preferred_contact_method)} / ${mapOne(L.time, row.preferred_contact_time)}`}
            />
            <Row label="業種" value={mapAll(L.industry, row.industries, row.industry_other)} />
            <Row
              label="現在のHP"
              value={
                row.website_url ? (
                  <a className="text-blue-700 underline" href={row.website_url} target="_blank" rel="noopener noreferrer">
                    {mapOne(L.website, row.has_website)}（{row.website_url}）
                  </a>
                ) : mapOne(L.website, row.has_website)
              }
            />
            <Row label="相談内容" value={mapAll(L.topic, row.consultation_topics, row.consultation_other)} />
            <Row label="お悩み" value={mapAll(L.problem, row.current_problems, row.problem_other)} />
            <Row label="希望プラン" value={mapOne(L.plan, row.selected_plan)} />
            <Row label="希望時期" value={mapOne(L.timing, row.desired_timing)} />
            <Row
              label="流入元"
              value={
                row.utm_source
                  ? `${row.utm_source} / ${row.utm_medium ?? "—"} / ${row.utm_campaign ?? "—"}`
                  : row.referrer || "直接アクセス"
              }
            />
          </dl>
        </section>

        {/* 対応履歴 */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <h2 className="mb-4 text-sm font-bold text-slate-900">対応履歴・メモ</h2>

          {/* 追加フォーム */}
          <div className="mb-5 rounded-lg bg-slate-50 p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {ACTIVITY_TYPES.map((t) => {
                const Icon = t.icon;
                const on = type === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    aria-pressed={on}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                      on
                        ? "border-slate-800 bg-slate-800 text-white"
                        : "border-slate-300 bg-white text-slate-600 hover:border-slate-500"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {t.label}
                  </button>
                );
              })}
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder="例：電話で通話。今月中に提案書を送ることになった。"
              className="w-full rounded-lg border border-slate-300 p-3 text-base outline-none focus:border-slate-500"
            />
            <button
              type="button"
              onClick={addActivity}
              disabled={saving || !content.trim()}
              className="mt-2 w-full rounded-lg bg-slate-800 py-2.5 text-sm font-bold text-white disabled:opacity-40"
            >
              {saving ? "保存中..." : "記録する"}
            </button>
          </div>

          {/* 履歴一覧 */}
          {activities.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              まだ記録がありません。
            </p>
          ) : (
            <ol className="space-y-3">
              {activities.map((a) => {
                const meta = TYPE_META[a.activity_type] ?? TYPE_META.note;
                return (
                  <li key={a.id} className="border-l-2 border-slate-200 pl-3">
                    <div className="flex items-center gap-2">
                      <span className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${meta.cls}`}>
                        {meta.label}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {formatDateTime(a.created_at)}
                      </span>
                      {a.activity_type !== "status" && (
                        <button
                          type="button"
                          onClick={() => removeActivity(a.id)}
                          aria-label="この記録を削除"
                          className="ml-auto text-slate-300 hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-slate-800">{a.content}</p>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-3">
      <dt className="text-xs font-bold text-slate-500">{label}</dt>
      <dd className="break-words text-slate-800">{value}</dd>
    </div>
  );
}
