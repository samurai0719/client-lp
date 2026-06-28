"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Download, Filter, AlertCircle } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatCurrency, formatDate, minutesAgo } from "@/lib/utils/format";
import { LEAD_STATUSES, LEAD_STATUS_LABELS, type LeadWithCustomer, type LeadStatus } from "@/lib/types/crm";
import { mockLeads } from "@/lib/mock/crmData";
import { isSupabaseConfigured } from "@/lib/supabase/check";

export default function LeadsListContent() {
  const [leads, setLeads] = useState<LeadWithCustomer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "">("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 20;

  const loadLeads = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured()) {
      let filtered = mockLeads;
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (l) =>
            l.customer.name.includes(q) ||
            l.customer.phone.includes(q) ||
            (l.customer.city ?? "").includes(q)
        );
      }
      if (statusFilter) filtered = filtered.filter((l) => l.status === statusFilter);
      if (sourceFilter) filtered = filtered.filter((l) => l.source === sourceFilter);
      setTotal(filtered.length);
      setLeads(filtered.slice((page - 1) * perPage, page * perPage));
      setLoading(false);
      return;
    }

    const params = new URLSearchParams({
      page: String(page),
      per_page: String(perPage),
    });
    if (search) params.set("q", search);
    if (statusFilter) params.set("status", statusFilter);
    if (sourceFilter) params.set("source", sourceFilter);

    const res = await fetch(`/api/admin/leads?${params}`);
    if (res.ok) {
      const data = await res.json();
      setLeads(data.leads);
      setTotal(data.total);
    }
    setLoading(false);
  }, [search, statusFilter, sourceFilter, page]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  async function handleCsvExport() {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (statusFilter) params.set("status", statusFilter);
    if (sourceFilter) params.set("source", sourceFilter);
    const url = isSupabaseConfigured()
      ? `/api/admin/csv?${params}`
      : "#";
    if (!isSupabaseConfigured()) {
      alert("Supabase 未接続のためCSV出力はできません");
      return;
    }
    window.open(url, "_blank");
  }

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-bold text-[#10302a]">顧客一覧</h1>
        <button
          onClick={handleCsvExport}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-[#174f3f] border border-[#174f3f] hover:bg-[#174f3f] hover:text-white transition-colors"
        >
          <Download className="w-4 h-4" />
          CSV出力
        </button>
      </div>

      {!isSupabaseConfigured() && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
          デモデータ表示中（Supabase 未接続）
        </div>
      )}

      {/* 検索・絞り込み */}
      <div className="bg-white rounded-2xl border border-[#e7e3d8] p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a9a90]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="名前・電話番号・地域で検索"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#dcd6c4] text-sm focus:outline-none focus:border-[#2f7d5a] focus:ring-2 focus:ring-[#2f7d5a]/20"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8a9a90]" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as LeadStatus | ""); setPage(1); }}
              className="pl-8 pr-3 py-2 rounded-lg border border-[#dcd6c4] text-xs text-[#3d4a45] focus:outline-none focus:border-[#2f7d5a] bg-white"
            >
              <option value="">全ステータス</option>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <select
            value={sourceFilter}
            onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-[#dcd6c4] text-xs text-[#3d4a45] focus:outline-none focus:border-[#2f7d5a] bg-white"
          >
            <option value="">全媒体</option>
            <option value="meta">Meta</option>
            <option value="google">Google</option>
            <option value="tiktok">TikTok</option>
            <option value="organic">オーガニック</option>
          </select>
        </div>
      </div>

      {/* テーブル */}
      <div className="bg-white rounded-2xl border border-[#e7e3d8] overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-[#6b7a73]">読み込み中...</div>
        ) : leads.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#6b7a73]">該当する顧客はいません</div>
        ) : (
          <>
            {/* デスクトップテーブル */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f0ece0] bg-[#f8f6ef]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b7a73]">受付日時</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b7a73]">顧客名</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b7a73]">電話番号</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b7a73]">地域</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b7a73]">希望工事</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b7a73]">流入元</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b7a73]">ステータス</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-[#6b7a73]">見積金額</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-[#6b7a73]">成約金額</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0ece0]">
                  {leads.map((lead) => {
                    const isUncontacted = lead.status === "new" || lead.status === "uncontacted";
                    const isUrgent = isUncontacted && minutesAgo(lead.created_at) > 30;
                    return (
                      <tr
                        key={lead.id}
                        className={`hover:bg-[#f8f6ef] transition-colors ${isUncontacted ? "bg-red-50/30" : ""}`}
                      >
                        <td className="px-4 py-3 text-xs text-[#6b7a73] whitespace-nowrap">
                          {formatDate(lead.created_at)}
                          {isUrgent && (
                            <span className="ml-1.5 inline-flex items-center">
                              <AlertCircle className="w-3 h-3 text-red-500" />
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/admin/leads/${lead.id}`} className="font-semibold text-[#10302a] hover:text-[#2f7d5a]">
                            {lead.customer.name} 様
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <a href={`tel:${lead.customer.phone}`} className="text-[#2f7d5a] hover:underline">
                            {lead.customer.phone}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-xs text-[#3d4a45]">{lead.customer.city ?? "—"}</td>
                        <td className="px-4 py-3 text-xs text-[#3d4a45] max-w-[140px] truncate">
                          {lead.work_types.join("、") || "—"}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#3d4a45]">{lead.source ?? "—"}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={lead.status} />
                        </td>
                        <td className="px-4 py-3 text-xs text-right text-[#3d4a45]">
                          {formatCurrency(lead.quoted_amount ?? lead.estimated_amount)}
                        </td>
                        <td className="px-4 py-3 text-xs text-right font-semibold text-[#174f3f]">
                          {formatCurrency(lead.contract_amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* モバイルカード */}
            <div className="sm:hidden divide-y divide-[#f0ece0]">
              {leads.map((lead) => {
                const isUncontacted = lead.status === "new" || lead.status === "uncontacted";
                const isUrgent = isUncontacted && minutesAgo(lead.created_at) > 30;
                return (
                  <Link
                    key={lead.id}
                    href={`/admin/leads/${lead.id}`}
                    className={`block px-4 py-3 hover:bg-[#f8f6ef] ${isUncontacted ? "bg-red-50/30" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-[#10302a]">{lead.customer.name} 様</p>
                        <p className="text-xs text-[#6b7a73] mt-0.5">{lead.customer.city} ・ {formatDate(lead.created_at)}</p>
                        <p className="text-xs text-[#3d4a45] mt-1">{lead.work_types.join("、") || "—"}</p>
                      </div>
                      <div className="shrink-0 text-right space-y-1">
                        <StatusBadge status={lead.status} />
                        {isUrgent && (
                          <p className="text-xs text-red-600 flex items-center gap-1 justify-end">
                            <AlertCircle className="w-3 h-3" />
                            30分超過
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg border border-[#e7e3d8] text-sm disabled:opacity-40 hover:bg-[#f0ece0] transition-colors"
          >
            前へ
          </button>
          <span className="text-sm text-[#6b7a73]">
            {page} / {totalPages}（全 {total} 件）
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg border border-[#e7e3d8] text-sm disabled:opacity-40 hover:bg-[#f0ece0] transition-colors"
          >
            次へ
          </button>
        </div>
      )}
    </div>
  );
}
