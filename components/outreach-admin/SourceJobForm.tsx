"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DEFAULT_GBIZ_KEYWORDS, DEFAULT_PLACES_KEYWORDS, PREFECTURE_NAMES } from "@/lib/outreach/constants";

type Source = "nta" | "gbizinfo" | "google_places" | "url_list";

const SOURCES: { key: Source; label: string; desc: string; env?: string }[] = [
  {
    key: "nta",
    label: "国税庁 法人番号（おすすめ・無料）",
    desc: "登記されている全法人のデータから、社名に「運送・運輸・物流・急便」等を含む会社を都道府県ごとに抽出。いちばん網羅的です。HPは gBizINFO の法人詳細から補います。",
  },
  {
    key: "gbizinfo",
    label: "gBizINFO（政府の法人データ）",
    desc: "経済産業省の法人オープンデータから、社名に「運送・運輸・物流」等を含む株式会社・有限会社を都道府県別に取得。公式HPのURLは法人詳細から取得します。無料（APIトークンが必要）。",
    env: "GBIZINFO_API_TOKEN",
  },
  {
    key: "google_places",
    label: "Google Places",
    desc: "Googleマップの施設検索で「運送会社 ○○県」等を検索し、社名・住所・電話・公式HPを取得。HPの登録率が高い（従量課金・APIキーが必要）。",
    env: "GOOGLE_PLACES_API_KEY",
  },
  { key: "url_list", label: "公式HPのURL一覧", desc: "手元にある運送会社の公式HPのURLを貼り付けて登録。会社名はHPのタイトルから補います。" },
];

export default function SourceJobForm({ configured }: { configured: Record<Source, boolean> }) {
  const router = useRouter();
  const [source, setSource] = useState<Source>("nta");
  const [prefs, setPrefs] = useState<string[]>([]);
  const [keywords, setKeywords] = useState("");
  const [urls, setUrls] = useState("");
  const [max, setMax] = useState("1000");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const defaults = source === "gbizinfo" ? DEFAULT_GBIZ_KEYWORDS : DEFAULT_PLACES_KEYWORDS;

  async function submit() {
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/adofy-admin/outreach/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source,
        prefectures: prefs,
        keywords: keywords.split(/[\s,、]+/).filter(Boolean),
        urls,
        max_companies: Number(max) || undefined,
      }),
    });
    setBusy(false);
    const j = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setMsg({ ok: false, text: j.error ?? "作成に失敗しました" });
      return;
    }
    setMsg({ ok: true, text: "取得を開始しました。この画面を開いている間（またはcronで）自動で進みます。" });
    setUrls("");
    router.refresh();
  }

  function togglePref(p: string) {
    setPrefs((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="mb-3 font-bold text-slate-900">新しく取得する</h2>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {SOURCES.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setSource(s.key)}
            className={`rounded-xl border p-3 text-left ${source === s.key ? "border-[#0a1f4e] bg-slate-50 ring-2 ring-[#0a1f4e]/20" : "border-slate-200"}`}
          >
            <p className="text-sm font-bold text-slate-900">{s.label}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{s.desc}</p>
            {s.env && !configured[s.key] && (
              <p className="mt-1.5 text-xs font-bold text-amber-700">環境変数 {s.env} が未設定です</p>
            )}
          </button>
        ))}
      </div>

      {source !== "url_list" ? (
        <>
          <div className="mt-4">
            <div className="mb-1.5 flex items-center gap-2">
              <p className="text-sm font-bold text-slate-700">都道府県</p>
              <span className="text-xs text-slate-400">{prefs.length === 0 ? "未選択＝全国" : `${prefs.length}件選択`}</span>
              {prefs.length > 0 && (
                <button type="button" onClick={() => setPrefs([])} className="text-xs text-blue-700 underline">
                  クリア
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PREFECTURE_NAMES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePref(p)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-bold ${prefs.includes(p) ? "border-[#0a1f4e] bg-[#0a1f4e] text-white" : "border-slate-200 text-slate-600"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          {source !== "nta" && (
          <label className="mt-4 block text-sm font-bold text-slate-700">
            検索キーワード（空欄なら既定）
            <input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder={defaults.join("、")}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-normal sm:text-sm"
            />
          </label>
          )}
        </>
      ) : (
        <label className="mt-4 block text-sm font-bold text-slate-700">
          公式HPのURL（1行に1件・最大5,000件）
          <textarea
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            rows={6}
            placeholder={"https://example-unso.co.jp/\nhttps://www.example-butsuryu.jp/"}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-base font-normal sm:text-sm"
          />
        </label>
      )}

      <label className="mt-4 block text-sm font-bold text-slate-700">
        新規登録の上限（社）
        <input
          type="number"
          min={1}
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="mt-1 w-40 rounded-lg border border-slate-300 px-3 py-2 text-base font-normal sm:text-sm"
        />
      </label>

      <button
        type="button"
        onClick={submit}
        disabled={busy || (source !== "url_list" && !configured[source])}
        className="mt-4 w-full rounded-xl bg-[#0a1f4e] py-3 text-base font-bold text-white disabled:opacity-40 sm:w-auto sm:px-8"
      >
        {busy ? "作成中…" : "取得を開始"}
      </button>
      {msg && <p className={`mt-2 text-sm font-bold ${msg.ok ? "text-emerald-700" : "text-rose-600"}`}>{msg.text}</p>}
    </section>
  );
}
