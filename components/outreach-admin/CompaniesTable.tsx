"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Check, ExternalLink, FileText, X } from "lucide-react";
import type { CompanyRow } from "@/lib/outreach/companies";
import { ADMIN_BASE, SOURCE_LABEL } from "@/lib/outreach/constants";
import { formatJst } from "@/lib/outreach/format";
import { CrawlBadge, OutreachStatusBadge, ReviewBadge } from "./Badges";

/**
 * 営業先企業の一覧。PCは表、スマホはカード。
 * 確認待ちモードでは、各社の「送信OK / 除外」と、まとめて操作するボタンを出す。
 */
export default function CompaniesTable({ rows, reviewMode }: { rows: CompanyRow[]; reviewMode: boolean }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<Record<string, "approved" | "excluded">>({});
  const [, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  async function review(ids: string[], value: "approved" | "excluded") {
    if (ids.length === 0) return;
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/adofy-admin/outreach/companies/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, review: value }),
    });
    setBusy(false);
    if (!res.ok) {
      setMessage(((await res.json().catch(() => ({}))) as { error?: string }).error ?? "更新に失敗しました");
      return;
    }
    setDone((d) => ({ ...d, ...Object.fromEntries(ids.map((id) => [id, value])) }));
    setSelected(new Set());
    setMessage(`${ids.length}社を「${value === "approved" ? "送信OK" : "除外"}」にしました`);
  }

  function toggle(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  const pendingIds = rows.filter((r) => !done[r.id]).map((r) => r.id);

  if (rows.length === 0) {
    return <p className="rounded-xl border border-slate-200 bg-white py-10 text-center text-sm text-slate-400">該当する企業はありません。</p>;
  }

  return (
    <div>
      {reviewMode && (
        <div className="sticky top-[57px] z-10 mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white/95 p-2.5 backdrop-blur">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <input
              type="checkbox"
              className="h-5 w-5"
              checked={selected.size > 0 && selected.size === pendingIds.length}
              onChange={(e) => setSelected(e.target.checked ? new Set(pendingIds) : new Set())}
            />
            全選択（{selected.size}）
          </label>
          <button
            type="button"
            disabled={busy || selected.size === 0}
            onClick={() => review([...selected], "approved")}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-40"
          >
            <Check className="h-4 w-4" /> 選択を送信OK
          </button>
          <button
            type="button"
            disabled={busy || selected.size === 0}
            onClick={() => review([...selected], "excluded")}
            className="inline-flex items-center gap-1 rounded-lg bg-slate-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-40"
          >
            <X className="h-4 w-4" /> 選択を除外
          </button>
          <button
            type="button"
            onClick={() => startTransition(() => router.refresh())}
            className="ml-auto rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700"
          >
            次の確認待ちを表示
          </button>
          {message && <p className="w-full text-xs font-bold text-emerald-700">{message}</p>}
        </div>
      )}

      {/* スマホ：カード */}
      <ul className="space-y-2 lg:hidden">
        {rows.map((r) => (
          <li key={r.id} className={`rounded-xl border bg-white p-3 ${done[r.id] ? "opacity-50" : ""} ${selected.has(r.id) ? "border-blue-400" : "border-slate-200"}`}>
            <div className="flex items-start gap-2">
              {reviewMode && !done[r.id] && (
                <input type="checkbox" className="mt-1 h-5 w-5 shrink-0" checked={selected.has(r.id)} onChange={() => toggle(r.id)} />
              )}
              <div className="min-w-0 flex-1">
                <Link href={`${ADMIN_BASE}/companies/${r.id}`} className="block truncate font-bold text-slate-900">
                  {r.company_name}
                </Link>
                <p className="text-xs text-slate-500">
                  {[r.prefecture, r.city].filter(Boolean).join(" ") || "地域不明"}・{SOURCE_LABEL[r.source] ?? r.source}
                </p>
                <p className="mt-1 break-all text-sm text-slate-700">{r.email ?? <span className="text-slate-400">メールなし</span>}</p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <CrawlBadge status={r.crawl_status} hasEmail={Boolean(r.email)} />
                  <ReviewBadge status={done[r.id] ?? r.review_status} />
                  <OutreachStatusBadge status={r.outreach_status} />
                  {r.refusal_notice && <span className="rounded-md bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700">送信お断り表示</span>}
                </div>
                <Evidence r={r} />
              </div>
            </div>
            {reviewMode && !done[r.id] && <ReviewButtons onReview={(v) => review([r.id], v)} busy={busy} />}
          </li>
        ))}
      </ul>

      {/* PC：表 */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white lg:block">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs text-slate-500">
            <tr>
              {reviewMode && <th className="w-10 px-3 py-2" />}
              <th className="px-3 py-2">会社名</th>
              <th className="px-3 py-2">都道府県</th>
              <th className="px-3 py-2">メールアドレス / HP</th>
              <th className="px-3 py-2">状態</th>
              <th className="px-3 py-2">最終送信</th>
              <th className="px-3 py-2">返信</th>
              {reviewMode && <th className="px-3 py-2 text-right">確認</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r) => (
              <tr key={r.id} className={`${done[r.id] ? "opacity-50" : ""} ${selected.has(r.id) ? "bg-blue-50/60" : ""} align-top`}>
                {reviewMode && (
                  <td className="px-3 py-2.5">
                    {!done[r.id] && <input type="checkbox" className="h-4 w-4" checked={selected.has(r.id)} onChange={() => toggle(r.id)} />}
                  </td>
                )}
                <td className="max-w-[16rem] px-3 py-2.5">
                  <Link href={`${ADMIN_BASE}/companies/${r.id}`} className="block truncate font-bold text-slate-900 hover:underline">
                    {r.company_name}
                  </Link>
                  <span className="text-xs text-slate-400">{SOURCE_LABEL[r.source] ?? r.source}</span>
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-slate-600">
                  {r.prefecture ?? "—"}
                  {r.city && <span className="block text-xs text-slate-400">{r.city}</span>}
                </td>
                <td className="max-w-[22rem] px-3 py-2.5">
                  <span className="block break-all text-slate-800">{r.email ?? <span className="text-slate-400">メールなし</span>}</span>
                  <Evidence r={r} />
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    <CrawlBadge status={r.crawl_status} hasEmail={Boolean(r.email)} />
                    <ReviewBadge status={done[r.id] ?? r.review_status} />
                    <OutreachStatusBadge status={r.outreach_status} />
                    {r.refusal_notice && <span className="rounded-md bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700">送信お断り表示</span>}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-xs text-slate-500">{formatJst(r.last_sent_at)}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-xs">{r.replied_at ? <span className="font-bold text-violet-700">返信あり</span> : "—"}</td>
                {reviewMode && (
                  <td className="px-3 py-2.5">
                    {!done[r.id] && <ReviewButtons onReview={(v) => review([r.id], v)} busy={busy} compact />}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Evidence({ r }: { r: CompanyRow }) {
  return (
    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
      {r.website_url && (
        <a href={r.website_url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-0.5 text-blue-700 hover:underline">
          HP <ExternalLink className="h-3 w-3" />
        </a>
      )}
      {r.email_source_url && /^https?:/.test(r.email_source_url) && (
        <a href={r.email_source_url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-0.5 text-blue-700 hover:underline">
          <FileText className="h-3 w-3" /> 掲載ページ
        </a>
      )}
      {r.contact_form_url && (
        <a href={r.contact_form_url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-0.5 text-slate-500 hover:underline">
          問い合わせフォーム <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}

function ReviewButtons({ onReview, busy, compact = false }: { onReview: (v: "approved" | "excluded") => void; busy: boolean; compact?: boolean }) {
  return (
    <div className={`flex gap-2 ${compact ? "justify-end" : "mt-3"}`}>
      <button
        type="button"
        disabled={busy}
        onClick={() => onReview("approved")}
        className={`inline-flex items-center justify-center gap-1 rounded-lg bg-emerald-600 font-bold text-white disabled:opacity-40 ${compact ? "px-2.5 py-1.5 text-xs" : "flex-1 py-2.5 text-sm"}`}
      >
        <Check className="h-4 w-4" /> 送信OK
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => onReview("excluded")}
        className={`inline-flex items-center justify-center gap-1 rounded-lg border border-slate-300 font-bold text-slate-700 disabled:opacity-40 ${compact ? "px-2.5 py-1.5 text-xs" : "flex-1 py-2.5 text-sm"}`}
      >
        <X className="h-4 w-4" /> 除外
      </button>
    </div>
  );
}
