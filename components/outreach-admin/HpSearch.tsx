"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Copy } from "lucide-react";
import { PREFECTURE_NAMES } from "@/lib/outreach/constants";

type Row = { id: string; key: string; name: string; address: string };

function buildPrompt(rows: Row[]): string {
  return [
    "あなたは企業調査の担当者です。以下の運送会社について、1社ずつ正確に調べてください。",
    "件数よりも正確さを最優先し、確認できなかった項目は必ず「なし」にしてください。",
    "",
    "【1社ごとの手順】",
    "1. 「会社名＋所在地（市区町村）」でWeb検索する",
    "2. 公式ホームページを実際に開き、サイト内に『会社名』と『所在地（市区町村・番地）』が書かれていることを確認する",
    "   ・同じ名前の別の会社（別の県・市の会社）のサイトは不可",
    "   ・会社名と所在地が確認できなければ、公式HPは「なし」",
    "3. 公式サイトはトップページだけでなく、サイト内の全ページを確認する",
    "   （会社概要・会社案内・アクセス・お問い合わせ・採用情報・求人・プライバシーポリシー・ページ下部のフッターなど）",
    "4. メールアドレスは、ページ上に文字として実際に書かれているものだけを答える",
    "   ・問い合わせフォームしかない場合は「なし」",
    "   ・会社の窓口（info@ / recruit@ など）を優先。無ければ担当者名やGmail等でも可",
    "5. 公式サイトにメールが無い場合だけ、その会社自身が掲載している求人票（ハローワーク・求人サイトの会社掲載ページ）に書かれたアドレスも可",
    "6. 電話番号は代表番号（FAX番号は不可）",
    "",
    "【使ってはいけないサイト（公式HP・メールの根拠にしない）】",
    "・企業データベースやまとめサイト（Baseconnect、iタウンページ、全国法人リスト、Mapion、NAVITIME、各種ランキング・比較サイト）",
    "・地図サイトや口コミサイト、SNS（Facebook・Instagram・X）",
    "・「営業メールお断り」等の記載があるページ",
    "",
    "【禁止事項】",
    "・URLやメールアドレスを推測・記憶で作らない（実際に開いて確認したものだけ）",
    "・確認していないのに「ある」と答えない",
    "",
    "【出力】",
    "「番号,公式HP,メールアドレス,メールが書かれているページURL,電話番号」の形式で1行に1社。",
    "全社分を必ず出力する。説明や前置きは不要。分からない項目は「なし」。",
    "",
    "番号,会社名,所在地",
    ...rows.map((r) => `${r.key},${r.name},${r.address}`),
  ].join("\n");
}

export default function HpSearch() {
  const router = useRouter();
  const [pref, setPref] = useState("");
  // ChatGPT は一度に多く調べさせるほど雑になるため、既定は10社
  const [size, setSize] = useState(10);
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
    const res = await fetch(`/api/adofy-admin/outreach/hp-search?limit=${size}${pref ? `&prefecture=${encodeURIComponent(pref)}` : ""}`);
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
      phoneAdded?: number;
      rejected?: string[];
      notFound?: number;
      error?: string;
    };
    setBusy(false);
    if (!res.ok) return setMsg({ ok: false, text: j.error ?? "登録に失敗しました" });
    setRejected(j.rejected ?? []);
    setMsg({
      ok: true,
      text: `メールアドレス ${j.emailAdded}件を登録（掲載ページで確認済み）・公式HP ${j.hpRegistered}件・電話番号 ${j.phoneAdded}件を登録・見つからず ${j.notFound}社。登録したアドレスは「確認待ち」で掲載ページを見て「送信OK」にしてください。公式HPは、システムがサイト内を最大40ページ巡回して、ChatGPTが見落としたアドレスも探します。`,
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
          <select value={size} onChange={(e) => setSize(Number(e.target.value))} className="rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm">
            {[5, 10, 20, 30].map((n) => (
              <option key={n} value={n}>{n}社ずつ</option>
            ))}
          </select>
          <button type="button" onClick={load} disabled={busy} className="rounded-lg bg-[#0a1f4e] px-4 py-2 text-sm font-bold text-white disabled:opacity-40">
            会社を表示
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
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              ChatGPT で「<b>検索</b>」をオンにし、モデルは「<b>Thinking（じっくり考える）</b>」系を選ぶと精度が上がります。
              一度に調べる社数は10社以下がおすすめです（多いほど確認が雑になります）。
            </p>
            <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-xs text-slate-700">{buildPrompt(rows)}</pre>
          </section>

          <section className={box}>
            <p className="text-sm font-bold text-slate-900">3. ChatGPTの答えをそのまま貼り付けて登録</p>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={10}
              placeholder={"1200001001422,https://www.example-unso.co.jp/,info@example-unso.co.jp,https://www.example-unso.co.jp/company/,058-123-4567\n1200001001892,なし,なし,なし,なし"}
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
