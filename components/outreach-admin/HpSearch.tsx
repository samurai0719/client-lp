"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Copy } from "lucide-react";
import { PREFECTURE_NAMES } from "@/lib/outreach/constants";

type Row = { id: string; key: string; name: string; address: string };

function buildPrompt(rows: Row[]): string {
  return [
    "以下の会社の「公式ホームページ」のURLを、Web検索で1社ずつ調べてください。",
    "",
    "ルール：",
    "・会社名と所在地が一致する、その会社自身の公式サイトだけを答える",
    "・Facebook・Instagram などのSNS、求人サイト、地図サイト、企業データベースのサイトは不可",
    "・見つからない、または自信がない場合は「なし」と書く（推測で答えない）",
    "・出力は「番号,URL」の形式で1行に1社。説明や前置きは不要",
    "",
    "番号,会社名,所在地",
    ...rows.map((r) => `${r.key},${r.name},${r.address}`),
  ].join("\n");
}

export default function HpSearch() {
  const router = useRouter();
  const [pref, setPref] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function load() {
    setBusy(true);
    setMsg(null);
    setAnswer("");
    const res = await fetch(`/api/adofy-admin/outreach/hp-search?limit=30${pref ? `&prefecture=${encodeURIComponent(pref)}` : ""}`);
    const j = (await res.json().catch(() => ({}))) as { rows?: Row[]; remaining?: number; error?: string };
    setBusy(false);
    if (!res.ok) return setMsg({ ok: false, text: j.error ?? "読み込めませんでした" });
    setRows(j.rows ?? []);
    setRemaining(j.remaining ?? 0);
  }

  async function copy() {
    await navigator.clipboard.writeText(buildPrompt(rows));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function submit() {
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/adofy-admin/outreach/hp-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: rows.map((r) => r.id), text: answer }),
    });
    const j = (await res.json().catch(() => ({}))) as { registered?: number; notFound?: number; error?: string };
    setBusy(false);
    if (!res.ok) return setMsg({ ok: false, text: j.error ?? "登録に失敗しました" });
    setMsg({
      ok: true,
      text: `URLを${j.registered}社登録しました（見つからず ${j.notFound}社）。HPの確認とメール取得は自動で進みます。続けて次の30社を表示できます。`,
    });
    setRows([]);
    setAnswer("");
    router.refresh();
  }

  const box = "rounded-xl border border-slate-200 bg-white p-4";
  return (
    <div className="space-y-4">
      <section className={box}>
        <p className="text-sm font-bold text-slate-900">1. 調べる会社を表示</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <select value={pref} onChange={(e) => setPref(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm">
            <option value="">すべての地域</option>
            {PREFECTURE_NAMES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <button type="button" onClick={load} disabled={busy} className="rounded-lg bg-[#0a1f4e] px-4 py-2 text-sm font-bold text-white disabled:opacity-40">
            30社を表示
          </button>
          {remaining !== null && <span className="self-center text-xs text-slate-500">未調査 残り {remaining.toLocaleString()}社</span>}
        </div>
      </section>

      {rows.length > 0 && (
        <>
          <section className={box}>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-slate-900">2. 指示文をコピーしてChatGPTに貼り付け（{rows.length}社）</p>
              <button type="button" onClick={copy} className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white">
                <Copy className="h-4 w-4" /> {copied ? "コピーしました" : "指示文をコピー"}
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-500">ChatGPT で「検索」がオンになっていることを確認してから送信してください。</p>
            <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-xs text-slate-700">{buildPrompt(rows)}</pre>
          </section>

          <section className={box}>
            <p className="text-sm font-bold text-slate-900">3. ChatGPTの答えをそのまま貼り付けて登録</p>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={10}
              placeholder={"1200001001422,https://www.example-unso.co.jp/\n1200001001892,なし"}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-base sm:text-sm"
            />
            <button
              type="button"
              onClick={submit}
              disabled={busy || !answer.trim()}
              className="mt-2 w-full rounded-xl bg-[#0a1f4e] py-3 font-bold text-white disabled:opacity-40 sm:w-auto sm:px-8"
            >
              {busy ? "登録中…" : "登録する"}
            </button>
            <p className="mt-1 text-xs text-slate-500">答えに含まれなかった会社・「なし」の会社は「見つからず」になり、次からは表示されません。</p>
          </section>
        </>
      )}
      {msg && <p className={`rounded-lg p-3 text-sm font-bold ${msg.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>{msg.text}</p>}
    </div>
  );
}
