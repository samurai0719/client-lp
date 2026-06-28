"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, AlertCircle } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatDate, isPast } from "@/lib/utils/format";
import type { LeadWithCustomer } from "@/lib/types/crm";
import { mockLeads } from "@/lib/mock/crmData";
import { isSupabaseConfigured } from "@/lib/supabase/check";

export default function ScheduleContent() {
  const [todayActions, setTodayActions] = useState<LeadWithCustomer[]>([]);
  const [upcomingActions, setUpcomingActions] = useState<LeadWithCustomer[]>([]);
  const [overdueActions, setOverdueActions] = useState<LeadWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured()) {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(todayStart.getTime() + 86400000);

        const withNextAction = mockLeads.filter((l) => l.next_action_at);
        setOverdueActions(withNextAction.filter((l) => new Date(l.next_action_at!) < todayStart));
        setTodayActions(withNextAction.filter((l) => {
          const d = new Date(l.next_action_at!);
          return d >= todayStart && d < todayEnd;
        }));
        setUpcomingActions(withNextAction.filter((l) => new Date(l.next_action_at!) >= todayEnd).sort(
          (a, b) => new Date(a.next_action_at!).getTime() - new Date(b.next_action_at!).getTime()
        ));
        setLoading(false);
        return;
      }
      const res = await fetch("/api/admin/schedule");
      if (res.ok) {
        const data = await res.json();
        setTodayActions(data.today);
        setUpcomingActions(data.upcoming);
        setOverdueActions(data.overdue);
      }
      setLoading(false);
    }
    load();
  }, []);

  const LeadCard = ({ lead }: { lead: LeadWithCustomer }) => (
    <Link
      href={`/admin/leads/${lead.id}`}
      className={`block bg-white rounded-xl border p-3 hover:bg-[#f8f6ef] transition-colors ${isPast(lead.next_action_at) ? "border-red-200" : "border-[#e7e3d8]"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-[#10302a]">{lead.customer.name} 様</p>
          <p className={`text-xs mt-0.5 ${isPast(lead.next_action_at) ? "text-red-600 font-semibold" : "text-[#6b7a73]"}`}>
            {formatDate(lead.next_action_at)}
          </p>
          <p className="text-xs text-[#8a9a90] mt-0.5">{lead.customer.city}</p>
        </div>
        <StatusBadge status={lead.status} />
      </div>
    </Link>
  );

  if (loading) {
    return <div className="py-16 text-center text-sm text-[#6b7a73]">読み込み中...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-[#174f3f]" />
        <h1 className="text-xl font-bold text-[#10302a]">対応予定</h1>
      </div>

      {!isSupabaseConfigured() && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
          デモデータ表示中（Supabase 未接続）
        </div>
      )}

      {overdueActions.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            期限超過
          </h2>
          <div className="space-y-2">
            {overdueActions.map((l) => <LeadCard key={l.id} lead={l} />)}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-sm font-bold text-[#10302a] mb-3">本日の予定</h2>
        {todayActions.length === 0 ? (
          <p className="text-sm text-[#6b7a73] bg-white rounded-xl border border-[#e7e3d8] p-4 text-center">本日の予定はありません</p>
        ) : (
          <div className="space-y-2">
            {todayActions.map((l) => <LeadCard key={l.id} lead={l} />)}
          </div>
        )}
      </section>

      {upcomingActions.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-[#10302a] mb-3">今後の予定</h2>
          <div className="space-y-2">
            {upcomingActions.map((l) => <LeadCard key={l.id} lead={l} />)}
          </div>
        </section>
      )}
    </div>
  );
}
