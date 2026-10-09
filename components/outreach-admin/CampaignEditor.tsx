"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Eye, Sparkles } from "lucide-react";
import { ADMIN_BASE, PREFECTURE_NAMES } from "@/lib/outreach/constants";
import { DEFAULT_BODY, DEFAULT_SUBJECT, PLACEHOLDERS } from "@/lib/outreach/templates";

type Initial = {
  id?: string;
  name: string;
  subject: string;
  body: string;
  landing_page_url: string;
  prefectures: string[];
};

type Preview = { company: string; email: string | null; subject: string; text: string };

/**
 * 営業メールの作成・編集（下書きのみ）。
 * AIは件名・本文の下書きを作るだけ。結果はこの画面に入り、プレビューで確認してから保存する。
 */
export default function CampaignEditor({ initial, defaultLanding, aiEnabled }: { initial?: Initial; defaultLanding: string; aiEnabled: boolean }) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? `ドラテク案内 ${new Date().toLocaleDateString("ja-JP")}`);
  const [subject, setSubject] = useState(initial?.subject ?? DEFAULT_SUBJECT);
  const [body, setBody] = useState(initial?.body ?? DEFAULT_BODY);
  const [landing, setLanding] = useState(initial?.landing_page_url ?? defaultLanding);
  const [prefs, setPrefs] = useState<string[]>(initial?.prefectures ?? []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Preview[] | null>(null);
  const [readiness, setReadiness] = useState<{ ready: boolean; problems: string[] } | null>(null);
  const [ai, setAi] = useState({ companyName: "", prefecture: "", websiteUrl: "", jobType: "大型・中型トラックドライバー", tone: "丁寧・簡潔" });
  const [aiBusy, setAiBusy] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  function insert(token: string) {
    const el = bodyRef.current;
    if (!el) return setBody((b) => b + token);
    const start = el.selectionStart ?? body.length;
    const end = el.selectionEnd ?? body.length;
    const next = body.slice(0, start) + token + body.slice(end);
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + token.length;
    });
  }

  async function generate() {
    setAiBusy(true);
    setError(null);
    const res = await fetch("/api/adofy-admin/outreach/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...ai, template: body }),
    });
    setAiBusy(false);
    const j = (await res.json().catch(() => ({}))) as { subject?: string; body?: string; error?: string };
    if (!res.ok || !j.subject || !j.body) {
      setError(j.error ?? "生成に失敗しました");
      return;
    }
    setSubject(j.subject);
    setBody(j.body);
    setPreviews(null);
  }

  async function preview() {
    setError(null);
    const res = await fetch("/api/adofy-admin/outreach/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body, landing_page_url: landing }),
    });
    const j = (await res.json().catch(() => ({}))) as { previews?: Preview[]; readiness?: { ready: boolean; problems: string[] }; error?: string };
    if (!res.ok) return setError(j.error ?? "プレビューに失敗しました");
    setPreviews(j.previews ?? []);
    setReadiness(j.readiness ?? null);
  }

  async function save() {
    setBusy(true);
    setError(null);
    const res = await fetch(initial?.id ? `/api/adofy-admin/outreach/campaigns/${initial.id}` : "/api/adofy-admin/outreach/campaigns", {
      method: initial?.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, subject, body, landing_page_url: landing, prefectures: prefs }),
    });
    setBusy(false);
    const j = (await res.json().catch(() => ({}))) as { id?: string; error?: string };
    if (!res.ok) return setError(j.error ?? "保存に失敗しました");
    if (initial?.id) router.refresh();
    else router.push(`${ADMIN_BASE}/campaigns/${j.id}`);
  }

  const input = "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-normal text-slate-900 sm:text-sm";
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
        <label className="block text-sm font-bold text-slate-700">
          管理用の名前
          <input value={name} onChange={(e) => setName(e.target.value)} className={input} />
        </label>
        <label className="block text-sm font-bold text-slate-700">
          件名
          <input value={subject} onChange={(e) => setSubject(e.target.value)} className={input} />
        </label>
        <div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-bold text-slate-700">本文</span>
            {PLACEHOLDERS.map((p) => (
              <button key={p.key} type="button" onClick={() => insert(p.key)} title={p.label} className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-700 hover:bg-slate-200">
                {p.key}
              </button>
            ))}
          </div>
          <textarea ref={bodyRef} value={body} onChange={(e) => setBody(e.target.value)} rows={22} className={`${input} font-mono leading-relaxed`} />
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            {"{{recipient}}"} は会社名があれば「会社名＋ご担当者様」、無ければ「採用ご担当者様」になります。
            「株式会社{"{{company_name}}"}」と書いても、社名に法人格が含まれる場合は二重になりません。
            送信者情報・配信停止URLのフッターは送信時に自動で付きます（本文に書く必要はありません）。
          </p>
        </div>
        <label className="block text-sm font-bold text-slate-700">
          LPのURL（企業ごとのUTMとクリック計測は自動で付きます）
          <input value={landing} onChange={(e) => setLanding(e.target.value)} className={input} />
        </label>
        <div>
          <p className="text-sm font-bold text-slate-700">
            送信対象の地域 <span className="text-xs font-normal text-slate-400">{prefs.length ? `${prefs.length}件` : "未選択＝全国"}</span>
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {PREFECTURE_NAMES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPrefs((c) => (c.includes(p) ? c.filter((x) => x !== p) : [...c, p]))}
                className={`rounded-full border px-2.5 py-1 text-xs font-bold ${prefs.includes(p) ? "border-[#0a1f4e] bg-[#0a1f4e] text-white" : "border-slate-200 text-slate-600"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row">
          <button type="button" onClick={preview} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-800">
            <Eye className="h-4 w-4" /> 送信イメージを確認
          </button>
          <button type="button" onClick={save} disabled={busy} className="rounded-xl bg-[#0a1f4e] px-8 py-3 font-bold text-white disabled:opacity-40">
            {busy ? "保存中…" : "下書きを保存"}
          </button>
        </div>
        {error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

        {previews && (
          <div className="space-y-3">
            {readiness && !readiness.ready && (
              <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
                送信には設定が必要です：{readiness.problems.join(" / ")}
              </p>
            )}
            {previews.map((p, i) => (
              <div key={i} className="rounded-xl border border-slate-200">
                <p className="border-b border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                  宛先例：<b className="text-slate-800">{p.company}</b> {p.email ? `<${p.email}>` : ""}
                </p>
                <p className="px-3 pt-2 text-sm font-bold text-slate-900">件名：{p.subject}</p>
                <pre className="whitespace-pre-wrap px-3 pb-3 pt-2 font-sans text-sm leading-relaxed text-slate-800">{p.text}</pre>
              </div>
            ))}
          </div>
        )}
      </section>

      <aside className="space-y-3">
        <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-3">
          <p className="flex items-center gap-1.5 text-sm font-bold text-violet-900">
            <Sparkles className="h-4 w-4" /> AIで文章を作成
          </p>
          <p className="mt-1 text-xs text-violet-900/80">
            今の本文をベースに、地域や職種に合わせて書き直します。送信はされません。必ず内容を確認してから保存してください。
          </p>
          {(
            [
              ["companyName", "会社名（任意）"],
              ["prefecture", "地域（例：埼玉県）"],
              ["websiteUrl", "会社HP（任意）"],
              ["jobType", "募集職種"],
              ["tone", "トーン"],
            ] as const
          ).map(([k, label]) => (
            <label key={k} className="mt-2 block text-xs font-bold text-slate-600">
              {label}
              <input value={ai[k]} onChange={(e) => setAi((a) => ({ ...a, [k]: e.target.value }))} className={input} />
            </label>
          ))}
          <button
            type="button"
            disabled={!aiEnabled || aiBusy}
            onClick={generate}
            className="mt-3 w-full rounded-lg bg-violet-600 py-2.5 text-sm font-bold text-white disabled:opacity-40"
          >
            {aiBusy ? "作成中…" : "AIで文章を作成"}
          </button>
          {!aiEnabled && <p className="mt-1 text-xs text-amber-700">OPENAI_API_KEY が未設定のため使えません</p>}
        </section>
      </aside>
    </div>
  );
}
