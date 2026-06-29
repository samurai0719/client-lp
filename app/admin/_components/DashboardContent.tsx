"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Clock, TrendingUp, CheckCircle2 } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatCurrency, formatDate, isPast } from "@/lib/utils/format";
import type { LeadWithCustomer } from "@/lib/types/crm";
import { mockLeads } from "@/lib/mock/crmData";
import { shouldUseDemoData } from "@/lib/supabase/check";

interface DashboardStats {
  todayCount: number;
  monthCount: number;
  uncontactedCount: number;
  siteVisitScheduled: number;
  estimateSent: number;
  contractedCount: number;
  monthEstimatedRevenue: number;
  monthContractRevenue: number;
}

export default function DashboardContent() {
  const [stats, setStats] = useState<DashboardStats>({
    todayCount: 0,
    monthCount: 0,
    uncontactedCount: 0,
    siteVisitScheduled: 0,
    estimateSent: 0,
    contractedCount: 0,
    monthEstimatedRevenue: 0,
    monthContractRevenue: 0,
  });
  const [recentLeads, setRecentLeads] = useState<LeadWithCustomer[]>([]);
  const [todayActions, setTodayActions] = useState<LeadWithCustomer[]>([]);
  const [urgentLeads, setUrgentLeads] = useState<LeadWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (shouldUseDemoData()) {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const todayLeads = mockLeads.filter(l => new Date(l.created_at) >= todayStart);
        const monthLeads = mockLeads.filter(l => new Date(l.created_at) >= monthStart);
        const uncontacted = mockLeads.filter(l => l.status === "new" || l.status === "uncontacted");
        const contracted = mockLeads.filter(l => ["contracted", "under_construction", "completed"].includes(l.status));

        setStats({
          todayCount: todayLeads.length,
          monthCount: monthLeads.length,
          uncontactedCount: uncontacted.length,
          siteVisitScheduled: mockLeads.filter(l => l.status === "site_visit_scheduled").length,
          estimateSent: mockLeads.filter(l => l.status === "estimate_sent").length,
          contractedCount: contracted.length,
          monthEstimatedRevenue: mockLeads.filter(l => new Date(l.created_at) >= monthStart)
            .reduce((s, l) => s + (l.estimated_amount ?? l.quoted_amount ?? 0), 0),
          monthContractRevenue: contracted
            .filter(l => new Date(l.updated_at) >= monthStart)
            .reduce((s, l) => s + (l.contract_amount ?? 0), 0),
        });

        setRecentLeads(mockLeads.slice(0, 5));
        setTodayActions(mockLeads.filter(l => l.next_action_at && new Date(l.next_action_at).toDateString() === new Date().toDateString()));
        setUrgentLeads(uncontacted.filter(l => (Date.now() - new Date(l.created_at).getTime()) > 30 * 60000));
        setLoading(false);
        return;
      }

      const res = await fetch("/api/admin/dashboard");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentLeads(data.recentLeads);
        setTodayActions(data.todayActions);
        setUrgentLeads(data.urgentLeads);
      }
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { label: "今日の問い合わせ", value: stats.todayCount, color: "text-blue-700" },
    { label: "今月の問い合わせ", value: stats.monthCount, color: "text-indigo-700" },
    { label: "未対応", value: stats.uncontactedCount, color: "text-red-700", alert: stats.uncontactedCount > 0 },
    { label: "現地調査予定", value: stats.siteVisitScheduled, color: "text-purple-700" },
    { label: "見積もり提出済み", value: stats.estimateSent, color: "text-amber-700" },
    { label: "成約", value: stats.contractedCount, color: "text-green-700" },
    { label: "今月見込み売上", value: formatCurrency(stats.monthEstimatedRevenue), color: "text-[#174f3f]", isAmount: true },
    { label: "今月成約売上", value: formatCurrency(stats.monthContractRevenue), color: "text-[#174f3f]", isAmount: true },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#6b7a73] text-sm">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#10302a]">ダッシュボード</h1>
        <p className="text-sm text-[#6b7a73] mt-0.5">
          {new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" })}
        </p>
        {shouldUseDemoData() && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
            デモデータ表示中（Supabase 未接続）
          </div>
        )}
      </div>

      {/* 集計カード */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`bg-white rounded-2xl border p-4 ${card.alert ? "border-red-200" : "border-[#e7e3d8]"}`}
          >
            <p className="text-xs text-[#6b7a73] mb-1 leading-tight">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color} ${card.isAmount ? "text-base" : ""}`}>
              {typeof card.value === "number" ? card.value : card.value}
            </p>
          </div>
        ))}
      </div>

      {/* 本日の対応予定 */}
      {todayActions.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-[#10302a] mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#d9601a]" />
            本日の対応予定
          </h2>
          <div className="space-y-2">
            {todayActions.map((lead) => (
              <Link
                key={lead.id}
                href={`/admin/leads/${lead.id}`}
                className={`block bg-white rounded-xl border p-3 hover:bg-[#f8f6ef] transition-colors ${
                  isPast(lead.next_action_at) ? "border-red-300" : "border-[#e7e3d8]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-[#10302a]">{lead.customer.name} 様</p>
                    <p className={`text-xs mt-0.5 ${isPast(lead.next_action_at) ? "text-red-600 font-semibold" : "text-[#6b7a73]"}`}>
                      {formatDate(lead.next_action_at)}
                      {isPast(lead.next_action_at) && " ⚠ 期限超過"}
                    </p>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 未対応警告 */}
      {urgentLeads.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-[#10302a] mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            30分以上未対応
          </h2>
          <div className="space-y-2">
            {urgentLeads.map((lead) => (
              <Link
                key={lead.id}
                href={`/admin/leads/${lead.id}`}
                className="block bg-red-50 rounded-xl border border-red-200 p-3 hover:bg-red-100 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-[#10302a]">{lead.customer.name} 様</p>
                    <p className="text-xs text-red-600 mt-0.5">受付：{formatDate(lead.created_at)}</p>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 直近の問い合わせ */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#10302a] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#174f3f]" />
            直近の問い合わせ
          </h2>
          <Link href="/admin/leads" className="text-xs text-[#2f7d5a] font-medium hover:underline">
            すべて見る
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-[#e7e3d8] overflow-hidden">
          {recentLeads.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="w-8 h-8 text-[#bcd5c8] mx-auto mb-2" />
              <p className="text-sm text-[#6b7a73]">問い合わせはありません</p>
            </div>
          ) : (
            <div className="divide-y divide-[#f0ece0]">
              {recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-[#f8f6ef] transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#10302a] truncate">{lead.customer.name} 様</p>
                    <p className="text-xs text-[#6b7a73] mt-0.5 truncate">
                      {lead.customer.city} ・ {lead.work_types.join("、") || "未選択"}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <StatusBadge status={lead.status} />
                    <p className="text-xs text-[#6b7a73] mt-1">{formatDate(lead.created_at)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
