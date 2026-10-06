"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CalendarClock, Download, Phone, Search, X } from "lucide-react";
import {
  DEVICE_LABEL,
  LEAD_STATUSES,
  PLAN_LABEL,
  SOURCE_LABEL,
  STATUS_LABEL,
  classifySource,
  formatJst,
  jstDateKey,
  type LeadRow,
  type LeadStatus,
  type SourceKey,
} from "@/lib/saiyoRescue/leads";
import { SourceBadge } from "./Badges";
import StatusSelect from "./StatusSelect";

type Sort = "new" | "old" | "next";

const ALL = "";

/**
 * 問い合わせ一覧。データ量が少ないため全件を受け取り、検索・絞り込み・並び替えはブラウザ側で即時に行う。
 * PCはテーブル、スマホはカード表示。
 */
export default function LeadsList({ leads: initial }: { leads: LeadRow[] }) {
  const router = useRouter();
  const [leads, setLeads] = useState(initial);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState(ALL);
  const [pref, setPref] = useState(ALL);
  const [job, setJob] = useState(ALL);
  const [source, setSource] = useState(ALL);
  const [assignee, setAssignee] = useState(ALL);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<Sort>("new");

  const uniq = (fn: (l: LeadRow) => string | null) =>
    [...new Set(leads.map(fn).filter((v): v is string => Boolean(v)))].sort((a, b) => a.localeCompare(b, "ja"));
  const prefs = useMemo(() => uniq((l) => l.prefecture), [leads]); // eslint-disable-line react-hooks/exhaustive-deps
  const jobs = useMemo(() => uniq((l) => l.job_type), [leads]); // eslint-disable-line react-hooks/exhaustive-deps
  const assignees = useMemo(() => uniq((l) => l.assigned_to), [leads]); // eslint-disable-line react-hooks/exhaustive-deps
  const sources = useMemo(() => [...new Set(leads.map((l) => classifySource(l)))], [leads]);

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    const kwDigits = kw.replace(/\D/g, "");
    const list = leads.filter((l) => {
      if (status && l.status !== status) return false;
      if (pref && l.prefecture !== pref) return false;
      if (job && l.job_type !== job) return false;
      if (source && classifySource(l) !== source) return false;
      if (assignee === "__none" ? Boolean(l.assigned_to) : assignee && l.assigned_to !== assignee) return false;
      const day = jstDateKey(l.created_at);
      if (from && day < from) return false;
      if (to && day > to) return false;
      if (kw) {
        const hay = [l.company_name, l.contact_name, l.email, l.job_type, l.phone].join(" ").toLowerCase();
        const phoneHit = kwDigits.length >= 3 && l.phone.replace(/\D/g, "").includes(kwDigits);
        if (!hay.includes(kw) && !phoneHit) return false;
      }
      return true;
    });
    return list.sort((a, b) => {
      if (sort === "old") return a.created_at.localeCompare(b.created_at);
      if (sort === "next") {
        // 次回対応日が近い順。未設定は最後
        if (!a.next_contact_at && !b.next_contact_at) return b.created_at.localeCompare(a.created_at);
        if (!a.next_contact_at) return 1;
        if (!b.next_contact_at) return -1;
        return a.next_contact_at.localeCompare(b.next_contact_at);
      }
      return b.created_at.localeCompare(a.created_at);
    });
  }, [leads, q, status, pref, job, source, assignee, from, to, sort]);

  const filtering = Boolean(q || status || pref || job || source || assignee || from || to);
  const reset = () => {
    setQ("");
    setStatus(ALL);
    setPref(ALL);
    setJob(ALL);
    setSource(ALL);
    setAssignee(ALL);
    setFrom("");
    setTo("");
  };

  const setLeadStatus = (id: string, s: LeadStatus) =>
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status: s } : l)));

  const today = jstDateKey(new Date());

  return (
    <div>
      {/* 検索・絞り込み */}
      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="会社名・担当者・電話番号・メール・職種で検索"
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-base sm:text-sm"
            />
          </label>
          <div className="flex gap-2">
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={sel} aria-label="並び替え">
              <option value="new">新しい順</option>
              <option value="old">古い順</option>
              <option value="next">次回対応日順</option>
            </select>
            <button
              type="button"
              onClick={() => downloadCsv(filtered)}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#0a1f4e] px-3 py-2 text-sm font-bold text-white hover:bg-[#13306f]"
            >
              <Download className="h-4 w-4" />
              CSVダウンロード
            </button>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={sel} aria-label="ステータス">
            <option value={ALL}>ステータス：すべて</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
          <select value={pref} onChange={(e) => setPref(e.target.value)} className={sel} aria-label="都道府県">
            <option value={ALL}>都道府県：すべて</option>
            {prefs.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <select value={job} onChange={(e) => setJob(e.target.value)} className={sel} aria-label="職種">
            <option value={ALL}>職種：すべて</option>
            {jobs.map((j) => (
              <option key={j}>{j}</option>
            ))}
          </select>
          <select value={source} onChange={(e) => setSource(e.target.value)} className={sel} aria-label="流入元">
            <option value={ALL}>流入元：すべて</option>
            {sources.map((s) => (
              <option key={s} value={s}>
                {SOURCE_LABEL[s as SourceKey]}
              </option>
            ))}
          </select>
          <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className={sel} aria-label="担当者">
            <option value={ALL}>担当者：すべて</option>
            <option value="__none">未割り当て</option>
            {assignees.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
          <div className="col-span-2 flex items-center gap-1 sm:col-span-1 lg:col-span-1">
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={`${sel} min-w-0 flex-1`} aria-label="問い合わせ日（から）" />
            <span className="text-xs text-slate-400">〜</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={`${sel} min-w-0 flex-1`} aria-label="問い合わせ日（まで）" />
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-sm text-slate-500">
          <span>
            {filtered.length}件{filtering && ` / 全${leads.length}件`}
          </span>
          {filtering && (
            <button type="button" onClick={reset} className="inline-flex items-center gap-1 font-bold text-blue-700">
              <X className="h-4 w-4" />
              条件をクリア
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-500">
          {leads.length === 0 ? "まだ問い合わせがありません。" : "条件に一致する問い合わせがありません。"}
        </div>
      ) : (
        <>
          {/* PC：テーブル */}
          <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white lg:block">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-bold text-slate-500">
                <tr>
                  {["受付日時", "会社名", "担当者名", "電話番号", "職種", "地域", "流入元", "ステータス", "次回対応", "担当者"].map((h) => (
                    <th key={h} className="whitespace-nowrap px-3 py-2.5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((l) => {
                  const nextDay = l.next_contact_at ? jstDateKey(l.next_contact_at) : null;
                  return (
                    <tr
                      key={l.id}
                      onClick={() => router.push(`/adofy-admin/saiyo-rescue/leads/${l.id}`)}
                      className="cursor-pointer hover:bg-blue-50/50"
                    >
                      <td className="whitespace-nowrap px-3 py-2.5 text-slate-500">{formatJst(l.created_at)}</td>
                      <td className="px-3 py-2.5 font-bold text-slate-900">
                        <Link href={`/adofy-admin/saiyo-rescue/leads/${l.id}`} onClick={(e) => e.stopPropagation()} className="hover:underline">
                          {l.company_name}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5">{l.contact_name}</td>
                      <td className="whitespace-nowrap px-3 py-2.5">
                        <a href={`tel:${l.phone}`} onClick={(e) => e.stopPropagation()} className="text-blue-700 hover:underline">
                          {l.phone}
                        </a>
                      </td>
                      <td className="px-3 py-2.5">{l.job_type}</td>
                      <td className="whitespace-nowrap px-3 py-2.5">{l.prefecture}</td>
                      <td className="px-3 py-2.5">
                        <SourceBadge lead={l} />
                      </td>
                      <td className="px-3 py-2.5">
                        <StatusSelect id={l.id} value={l.status} onChange={(s) => setLeadStatus(l.id, s)} />
                      </td>
                      <td
                        className={`whitespace-nowrap px-3 py-2.5 ${
                          nextDay && nextDay < today ? "font-bold text-rose-600" : nextDay === today ? "font-bold text-amber-700" : "text-slate-600"
                        }`}
                      >
                        {l.next_contact_at ? formatJst(l.next_contact_at) : "—"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-slate-600">{l.assigned_to ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* スマホ・タブレット：カード */}
          <ul className="grid gap-3 sm:grid-cols-2 lg:hidden">
            {filtered.map((l) => {
              const nextDay = l.next_contact_at ? jstDateKey(l.next_contact_at) : null;
              return (
                <li key={l.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/adofy-admin/saiyo-rescue/leads/${l.id}`} className="min-w-0 flex-1">
                      <p className="truncate text-base font-bold text-slate-900">{l.company_name}</p>
                      <p className="text-sm text-slate-500">{l.contact_name} 様</p>
                    </Link>
                    <StatusSelect id={l.id} value={l.status} onChange={(s) => setLeadStatus(l.id, s)} />
                  </div>
                  <Link href={`/adofy-admin/saiyo-rescue/leads/${l.id}`} className="mt-2 block text-sm text-slate-700">
                    <p className="font-bold">{l.job_type}採用</p>
                    <p>{l.prefecture}</p>
                  </Link>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <a
                      href={`tel:${l.phone}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white"
                    >
                      <Phone className="h-4 w-4" />
                      {l.phone}
                    </a>
                    <SourceBadge lead={l} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-1 text-xs text-slate-500">
                    <span>{formatJst(l.created_at)}</span>
                    {l.next_contact_at && (
                      <span
                        className={`inline-flex items-center gap-1 font-bold ${
                          nextDay && nextDay < today ? "text-rose-600" : nextDay === today ? "text-amber-700" : "text-slate-600"
                        }`}
                      >
                        <CalendarClock className="h-3.5 w-3.5" />
                        次回 {formatJst(l.next_contact_at)}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

const sel = "rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm";

/* ── CSV（表示中の条件で出力。Excelで文字化けしないようBOM付きUTF-8） ── */
function downloadCsv(rows: LeadRow[]) {
  const cols: [string, (l: LeadRow) => string][] = [
    ["受付日時", (l) => formatJst(l.created_at)],
    ["ステータス", (l) => STATUS_LABEL[l.status]],
    ["会社名", (l) => l.company_name],
    ["担当者名", (l) => l.contact_name],
    ["電話番号", (l) => l.phone],
    ["メールアドレス", (l) => l.email],
    ["都道府県", (l) => l.prefecture],
    ["採用職種", (l) => l.job_type],
    ["現在の採用人数", (l) => l.current_employees ?? ""],
    ["希望採用人数", (l) => l.desired_hires ?? ""],
    ["現在の求人媒体", (l) => l.current_job_media ?? ""],
    ["月間採用広告費", (l) => l.monthly_recruitment_budget ?? ""],
    ["HP URL", (l) => l.website_url ?? ""],
    ["求人ページURL", (l) => l.job_page_url ?? ""],
    ["希望プラン", (l) => (l.desired_plan ? PLAN_LABEL[l.desired_plan] ?? l.desired_plan : "")],
    ["相談内容", (l) => l.message ?? ""],
    ["担当者", (l) => l.assigned_to ?? ""],
    ["次回対応日", (l) => formatJst(l.next_contact_at)],
    ["対応メモ", (l) => l.memo ?? ""],
    ["流入元", (l) => SOURCE_LABEL[classifySource(l)]],
    ["utm_source", (l) => l.utm_source ?? ""],
    ["utm_medium", (l) => l.utm_medium ?? ""],
    ["utm_campaign", (l) => l.utm_campaign ?? ""],
    ["utm_content", (l) => l.utm_content ?? ""],
    ["utm_term", (l) => l.utm_term ?? ""],
    ["landing_page", (l) => l.landing_page ?? ""],
    ["referrer", (l) => l.referrer ?? ""],
    ["端末", (l) => (l.device_type ? DEVICE_LABEL[l.device_type] : "")],
  ];
  // 数式として解釈される先頭文字を無害化（CSVインジェクション対策）
  const esc = (v: string) => {
    const safe = /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  const csv = [cols.map(([h]) => esc(h)).join(","), ...rows.map((r) => cols.map(([, f]) => esc(f(r))).join(","))].join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `saiyo-rescue-leads_${jstDateKey(new Date())}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}
