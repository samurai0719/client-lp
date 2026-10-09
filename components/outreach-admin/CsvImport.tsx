"use client";

import { useState } from "react";
import { CSV_HEADER_ALIASES, mapHeaders, parseCsv } from "@/lib/outreach/csv";

const FIELDS: { key: string; label: string }[] = [
  { key: "company_name", label: "会社名" },
  { key: "email", label: "メールアドレス" },
  { key: "phone", label: "電話番号" },
  { key: "prefecture", label: "都道府県" },
  { key: "city", label: "市区町村" },
  { key: "address", label: "住所" },
  { key: "website_url", label: "会社HP" },
  { key: "contact_name", label: "担当者名" },
  { key: "notes", label: "備考" },
];

const CHUNK = 200;

type Result = { inserted: number; duplicate: number; errors: string[]; warnings: string[] };

/** Excel の Shift_JIS 保存にも対応するため、UTF-8 で読めなければ Shift_JIS で読み直す */
function decode(buf: ArrayBuffer): string {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(buf);
  } catch {
    return new TextDecoder("shift_jis").decode(buf);
  }
}

export default function CsvImport() {
  const [rows, setRows] = useState<string[][]>([]);
  const [header, setHeader] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, number>>({});
  const [consent, setConsent] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onFile(file: File) {
    setResult(null);
    setError(null);
    const data = parseCsv(decode(await file.arrayBuffer()));
    if (data.length < 2) {
      setError("データ行がありません（1行目は見出しにしてください）");
      return;
    }
    setHeader(data[0]);
    setRows(data.slice(1));
    setMapping(mapHeaders(data[0]));
  }

  async function run() {
    setError(null);
    const objects = rows.map((r) =>
      Object.fromEntries(Object.entries(mapping).filter(([, i]) => i >= 0).map(([k, i]) => [k, (r[i] ?? "").trim()]))
    );
    const total: Result = { inserted: 0, duplicate: 0, errors: [], warnings: [] };
    setProgress({ done: 0, total: objects.length });
    for (let i = 0; i < objects.length; i += CHUNK) {
      const res = await fetch("/api/adofy-admin/outreach/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: objects.slice(i, i + CHUNK), consent }),
      });
      const j = (await res.json().catch(() => ({}))) as {
        inserted?: number;
        duplicate?: number;
        errors?: { row: number; message: string }[];
        warnings?: { row: number; message: string }[];
        error?: string;
      };
      if (!res.ok) {
        setError(j.error ?? "取り込みに失敗しました");
        break;
      }
      total.inserted += j.inserted ?? 0;
      total.duplicate += j.duplicate ?? 0;
      total.errors.push(...(j.errors ?? []).map((e) => `${i + e.row + 2}行目：${e.message}`));
      total.warnings.push(...(j.warnings ?? []).map((e) => `${i + e.row + 2}行目：${e.message}`));
      setProgress({ done: Math.min(i + CHUNK, objects.length), total: objects.length });
    }
    setResult(total);
  }

  const canRun = rows.length > 0 && consent && ((mapping.company_name ?? -1) >= 0 || (mapping.email ?? -1) >= 0);

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="mb-2 text-sm font-bold text-slate-700">1. CSVファイルを選択</p>
        <input type="file" accept=".csv,text/csv" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} className="block w-full text-sm" />
        <p className="mt-2 text-xs text-slate-500">
          1行目に見出しを入れてください。認識する見出し：
          {Object.values(CSV_HEADER_ALIASES).map((a) => a[0]).join("・")}（UTF-8 / Shift_JIS どちらでも可）
        </p>
      </section>

      {rows.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="mb-2 text-sm font-bold text-slate-700">2. 項目の対応（{rows.length.toLocaleString()}行）</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {FIELDS.map((f) => (
              <label key={f.key} className="text-xs font-bold text-slate-500">
                {f.label}
                <select
                  value={mapping[f.key] ?? -1}
                  onChange={(e) => setMapping((m) => ({ ...m, [f.key]: Number(e.target.value) }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-base font-normal text-slate-800 sm:text-sm"
                >
                  <option value={-1}>（使わない）</option>
                  {header.map((h, i) => (
                    <option key={i} value={i}>
                      {h || `${i + 1}列目`}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-slate-500">
                  {FIELDS.filter((f) => (mapping[f.key] ?? -1) >= 0).map((f) => (
                    <th key={f.key} className="px-2 py-1">{f.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 5).map((r, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    {FIELDS.filter((f) => (mapping[f.key] ?? -1) >= 0).map((f) => (
                      <td key={f.key} className="whitespace-nowrap px-2 py-1">{r[mapping[f.key]]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <label className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
            <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>
              このリストのメールアドレスは、<b>企業が自社サイト等で公表している法人の窓口アドレス</b>、または
              <b>営業メールの受信に同意を得たアドレス</b>です（個人のアドレスや、送信を拒否されたアドレスは含みません）。
            </span>
          </label>

          <button
            type="button"
            disabled={!canRun || (progress !== null && progress.done < progress.total)}
            onClick={run}
            className="mt-4 w-full rounded-xl bg-[#0a1f4e] py-3 font-bold text-white disabled:opacity-40 sm:w-auto sm:px-8"
          >
            取り込む
          </button>
          {progress && (
            <p className="mt-2 text-sm text-slate-600">
              {progress.done.toLocaleString()} / {progress.total.toLocaleString()} 行 処理済み
            </p>
          )}
        </section>
      )}

      {error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      {result && (
        <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <p className="font-bold">
            新規登録 {result.inserted.toLocaleString()}社・重複除外 {result.duplicate.toLocaleString()}件・エラー {result.errors.length}件
          </p>
          {result.warnings.length > 0 && (
            <details className="mt-2">
              <summary className="cursor-pointer font-bold text-amber-800">注意 {result.warnings.length}件</summary>
              <ul className="mt-1 max-h-60 list-disc overflow-y-auto pl-5 text-xs text-amber-900">
                {result.warnings.map((w) => <li key={w}>{w}</li>)}
              </ul>
            </details>
          )}
          {result.errors.length > 0 && (
            <ul className="mt-2 max-h-60 list-disc overflow-y-auto pl-5 text-xs text-rose-700">
              {result.errors.map((w) => <li key={w}>{w}</li>)}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
