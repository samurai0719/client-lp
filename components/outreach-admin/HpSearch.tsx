"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Copy } from "lucide-react";
import { PREFECTURE_NAMES } from "@/lib/outreach/constants";

type Row = { id: string; key: string; name: string; address: string };

function buildPrompt(rows: Row[]): string {
  return [
    "以下の運送会社について、Web検索で1社ずつ調べてください。",
    "",
    "調べること：",
    "1. 公式ホームページのURL",
    "2. 会社の問い合わせ用・採用用のメールアドレス（info@ / recruit@ / soumu@ など会社の窓口のもの）",
    "3. そのメールアドレスが実際に書かれているページのURL",
    "",
    "ルール：",
    "・会社名と所在地が一致する会社だけを答える（同名の別会社に注意）",
    "・メールアドレスは、公式サイト、またはその会社自身が掲載している求人票・会社紹介ページなど、実際にページに書かれているものだけ",
    "・メールアドレスを推測して作らない。担当者個人の名前のアドレスは除外",
    "・「営業メールお断り」等の記載があるページのアドレスは除外",
    "・公式HPがSNS・求人サイト・地図サイトしかない場合、公式HP欄は「なし」",
    "・見つからない、または自信がない項目は「なし」と書く",
    "・出力は「番号,公式HP,メールアドレス,メールが書かれているページURL」の形式で1行に1社。説明や前置きは不要",
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
  const [rejected, setRejected] = useState<string[]>([]);

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
    const j = (await res.json().catch(() => ({}))) as {
      hpRegistered?: number;
      emailAdded?: number;
      rejected?: string[];
      notFound?: number;
      error?: string;
    };
    setBusy(false);
    if (!res.ok) return setMsg({ ok: false, text: j.error ?? "登録に失敗しました" });
    setRejected(j.rejected ?? []);
    setMsg({
      ok: true,
      text: `メールアドレス ${j.emailAdded}件を登録（掲載ページで確認済み）・公式HP ${j.hpRegistered}件を登録・見つからず ${j.notFound}社。登録したアドレスは「確認待ち」で掲載ページを見て「送信OK」にしてください。`,
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
              placeholder={"1200001001422,https://www.example-unso.co.jp/,info@example-unso.co.jp,https://www.example-unso.co.jp/company/\n1200001001892,なし,なし,なし"}
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
            <p className="mt-1 text-xs text-slate-500">
              メールアドレスは、掲載ページを開いて本当に書かれているか・「営業メールお断り」がないかを確認してから登録します（1分ほどかかります）。
              答えに含まれなかった会社・「なし」の会社は「見つからず」になり、次からは表示されません。
            </p>
          </section>
        </>
      )}
      {msg && <p className={`rounded-lg p-3 text-sm font-bold ${msg.ok ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-700"}`}>{msg.text}</p>}
      {rejected.length > 0 && (
        <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
          <p className="font-bold">登録しなかったメールアドレス（{rejected.length}件）</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            {rejected.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
