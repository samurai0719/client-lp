"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ChevronRight, Search } from "lucide-react";
import {
  CONSULTATION_LABELS as L, STATUS_LABELS, STATUS_STYLES,
  formatDateTime, mapAll, mapOne, type Consultation,
} from "../_lib/labels";

/* ═══════════════════════════════════════════════════════════════════════════
   adofy 無料相談リードの管理画面。
   データ取得・更新はすべて /api/adofy-admin/consultations 経由（管理者認証あり）。
   ═══════════════════════════════════════════════════════════════════════════ */

export default function ConsultationsContent() {
  const [rows, setRows] = useState<Consultation[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ per_page: "50" });
      if (search) params.set("q", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/adofy-admin/consultations?${params}`);
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? "取得に失敗しました");
        setRows([]);
        return;
      }
      const j = await res.json();
      setRows(j.consultations ?? []);
      setTotal(j.total ?? 0);
    } catch {
      setError("通信エラーが発生しました");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const t = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, search]);

  const changeStatus = async (id: string, status: string) => {
    setSavingId(id);
    // 先に画面へ反映し、失敗したら元に戻す
    const prev = rows;
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
    try {
      const res = await fetch("/api/adofy-admin/consultations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        setRows(prev);
        setError("ステータスの更新に失敗しました");
      }
    } catch {
      setRows(prev);
      setError("通信エラーで更新できませんでした");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">adofy 無料相談</h1>
        <p className="mt-1 text-sm text-slate-500">
          建設業向けホームページ制作の相談フォームから届いたリード
          {!loading && <span className="ml-2 font-semibold text-slate-700">全 {total} 件</span>}
        </p>
      </div>

      {/* 検索・絞り込み */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="会社名・担当者・電話・メールで検索"
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-base outline-none focus:border-slate-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-base outline-none focus:border-slate-500"
          aria-label="ステータスで絞り込む"
        >
          <option value="">すべてのステータス</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </div>

      {error && (
        <p className="mb-4 flex items-center gap-2 rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
          <AlertCircle className="h-4 w-4 flex-none" />
          {error}
        </p>
      )}

      {loading ? (
        <p className="py-16 text-center text-sm text-slate-500">読み込み中...</p>
      ) : rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center">
          <p className="text-sm text-slate-500">該当する相談はまだありません。</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="flex flex-wrap items-center gap-3 p-4">
                <Link
                  href={`/adofy-admin/consultations/${r.id}`}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-slate-900">
                      {r.company_name}
                    </span>
                    <span className="block truncate text-xs text-slate-500">
                      {r.contact_name} ／ {r.prefecture}
                      {r.city ?? ""} ／ {mapOne(L.plan, r.selected_plan)} ／{" "}
                      {formatDateTime(r.created_at)}
                    </span>
                    <span className="mt-1 block truncate text-xs text-slate-400">
                      {mapAll(L.industry, r.industries, r.industry_other)}
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 flex-none text-slate-300" />
                </Link>

                <select
                  value={r.status}
                  disabled={savingId === r.id}
                  onChange={(e) => changeStatus(r.id, e.target.value)}
                  aria-label={`${r.company_name} のステータス`}
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold outline-none ${
                    STATUS_STYLES[r.status] ?? STATUS_STYLES.new
                  }`}
                >
                  {Object.entries(STATUS_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
