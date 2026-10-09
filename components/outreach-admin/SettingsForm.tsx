"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Values = {
  per_minute: number;
  per_hour: number;
  per_day: number;
  min_days_between_campaigns: number;
  sender_name: string;
  sender_address: string;
  sender_email: string;
  sender_phone: string;
};
type Limits = { per_minute: number; per_hour: number; per_day: number };

export default function SettingsForm({
  initial,
  fallback,
  providerLimits,
}: {
  initial: Values;
  fallback: Pick<Values, "sender_name" | "sender_address" | "sender_email" | "sender_phone">;
  providerLimits: Limits;
}) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function save() {
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/adofy-admin/outreach/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(v),
    });
    setBusy(false);
    const j = (await res.json().catch(() => ({}))) as { error?: string; clamped?: Limits };
    if (!res.ok) return setMsg({ ok: false, text: j.error ?? "保存に失敗しました" });
    if (j.clamped) setV((cur) => ({ ...cur, ...j.clamped }));
    setMsg({ ok: true, text: "保存しました（メール配信サービスの上限を超える値は上限に丸めています）" });
    router.refresh();
  }

  const num = (k: keyof Limits | "min_days_between_campaigns", label: string, max?: number) => (
    <label className="block text-sm font-bold text-slate-700">
      {label}
      <input
        type="number"
        min={k === "min_days_between_campaigns" ? 0 : 1}
        max={max}
        value={v[k]}
        onChange={(e) => setV((c) => ({ ...c, [k]: Number(e.target.value) }))}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-normal sm:text-sm"
      />
      {max !== undefined && <span className="text-xs font-normal text-slate-400">サービス上限 {max.toLocaleString()}</span>}
    </label>
  );
  const text = (k: keyof typeof fallback, label: string, placeholder?: string) => (
    <label className="block text-sm font-bold text-slate-700">
      {label}
      <input
        value={v[k]}
        onChange={(e) => setV((c) => ({ ...c, [k]: e.target.value }))}
        placeholder={fallback[k] || placeholder}
        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-normal sm:text-sm"
      />
    </label>
  );

  return (
    <>
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-1 font-bold text-slate-900">送信速度</h2>
        <p className="mb-3 text-xs text-slate-500">
          迷惑メール判定を避けるため、少しずつ送ります。上限はメール配信サービスの契約に合わせて環境変数
          OUTREACH_PROVIDER_MAX_PER_MINUTE / _PER_HOUR / _PER_DAY で設定し、ここではそれ以下の値だけ設定できます。
          新しい送信元ドメインは、最初の数日は1日100件程度から徐々に増やすのが安全です。
        </p>
        <div className="grid gap-3 sm:grid-cols-4">
          {num("per_minute", "1分あたり", providerLimits.per_minute)}
          {num("per_hour", "1時間あたり", providerLimits.per_hour)}
          {num("per_day", "1日（24時間）最大", providerLimits.per_day)}
          {num("min_days_between_campaigns", "同じ企業へ再送するまでの日数")}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-1 font-bold text-slate-900">送信者情報（メールのフッターに必ず表示）</h2>
        <p className="mb-3 text-xs text-slate-500">
          特定電子メール法により、送信者の氏名または名称・住所・受信拒否の連絡先の表示が必要です。すべて入力されるまで送信できません。
          空欄の場合はドラテクの事業者情報（NEXT_PUBLIC_DORATECH_*）を使います。
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {text("sender_name", "送信者名（事業者名）", "例：adofy")}
          {text("sender_address", "住所")}
          {text("sender_email", "連絡先メールアドレス（受信拒否・問い合わせ先）")}
          {text("sender_phone", "電話番号（任意）")}
        </div>
      </section>

      <div>
        <button type="button" disabled={busy} onClick={save} className="w-full rounded-xl bg-[#0a1f4e] py-3 font-bold text-white disabled:opacity-40 sm:w-auto sm:px-10">
          {busy ? "保存中…" : "設定を保存"}
        </button>
        {msg && <p className={`mt-2 text-sm font-bold ${msg.ok ? "text-emerald-700" : "text-rose-600"}`}>{msg.text}</p>}
      </div>
    </>
  );
}
