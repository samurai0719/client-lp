"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Calendar, List, ChevronLeft, ChevronRight, AlertCircle, MapPin, Clock } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatDate, isPast } from "@/lib/utils/format";
import type { LeadWithCustomer } from "@/lib/types/crm";
import { mockLeads } from "@/lib/mock/crmData";
import { shouldUseDemoData } from "@/lib/supabase/check";

type ViewMode = "calendar" | "list";

interface ScheduleData {
  siteVisits: LeadWithCustomer[];
  overdue: LeadWithCustomer[];
  today: LeadWithCustomer[];
  upcoming: LeadWithCustomer[];
}

const DAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

function toDateStr(iso: string) {
  return iso.slice(0, 10);
}

export default function ScheduleContent() {
  const [data, setData] = useState<ScheduleData>({ siteVisits: [], overdue: [], today: [], upcoming: [] });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (shouldUseDemoData()) {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(todayStart.getTime() + 86400000);
        const withNextAction = mockLeads.filter((l) => l.next_action_at);
        const siteVisits = mockLeads.filter((l) => l.site_visit_at);
        setData({
          siteVisits,
          overdue: withNextAction.filter((l) => new Date(l.next_action_at!) < todayStart),
          today: withNextAction.filter((l) => {
            const d = new Date(l.next_action_at!);
            return d >= todayStart && d < todayEnd;
          }),
          upcoming: withNextAction
            .filter((l) => new Date(l.next_action_at!) >= todayEnd)
            .sort((a, b) => new Date(a.next_action_at!).getTime() - new Date(b.next_action_at!).getTime()),
        });
        setLoading(false);
        return;
      }
      const res = await fetch("/api/admin/schedule");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
      setLoading(false);
    }
    load();
  }, []);

  // 表示月のカレンダーグリッド
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [currentMonth]);

  // 日付ごとのイベントマップ
  const eventsByDate = useMemo(() => {
    const map: Record<string, { siteVisits: LeadWithCustomer[]; nextActions: LeadWithCustomer[] }> = {};
    const ensure = (d: string) => {
      if (!map[d]) map[d] = { siteVisits: [], nextActions: [] };
    };
    for (const l of data.siteVisits) {
      if (l.site_visit_at) {
        const d = toDateStr(l.site_visit_at);
        ensure(d);
        map[d].siteVisits.push(l);
      }
    }
    for (const l of [...data.overdue, ...data.today, ...data.upcoming]) {
      if (l.next_action_at) {
        const d = toDateStr(l.next_action_at);
        ensure(d);
        map[d].nextActions.push(l);
      }
    }
    return map;
  }, [data]);

  const todayStr = new Date().toISOString().slice(0, 10);

  function prevMonth() {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
    setSelectedDay(null);
  }
  function nextMonth() {
    setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
    setSelectedDay(null);
  }

  function formatMonthLabel(d: Date) {
    return `${d.getFullYear()}年${d.getMonth() + 1}月`;
  }

  function getDayStr(day: number) {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}-${String(day).padStart(2, "0")}`;
  }

  const selectedEvents = selectedDay ? (eventsByDate[selectedDay] ?? { siteVisits: [], nextActions: [] }) : null;

  if (loading) {
    return <div className="py-16 text-center text-sm text-[#6b7a73]">読み込み中...</div>;
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#174f3f]" />
          <h1 className="text-xl font-bold text-[#10302a]">スケジュール</h1>
        </div>
        {/* タブ切替 */}
        <div className="flex rounded-xl border border-[#e7e3d8] overflow-hidden text-xs font-semibold">
          <button
            onClick={() => setViewMode("calendar")}
            className={`flex items-center gap-1 px-3 py-2 transition-colors ${viewMode === "calendar" ? "bg-[#174f3f] text-white" : "bg-white text-[#6b7a73] hover:bg-[#f8f6ef]"}`}
          >
            <Calendar className="w-3.5 h-3.5" />
            カレンダー
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1 px-3 py-2 transition-colors ${viewMode === "list" ? "bg-[#174f3f] text-white" : "bg-white text-[#6b7a73] hover:bg-[#f8f6ef]"}`}
          >
            <List className="w-3.5 h-3.5" />
            リスト
          </button>
        </div>
      </div>

      {shouldUseDemoData() && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
          デモデータ表示中（Supabase 未接続）
        </div>
      )}

      {/* 凡例 */}
      <div className="flex items-center gap-4 text-xs text-[#6b7a73]">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#174f3f] inline-block" />
          現地見積もり
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d9601a] inline-block" />
          次回連絡
        </span>
      </div>

      {viewMode === "calendar" ? (
        <>
          {/* カレンダー */}
          <div className="bg-white rounded-2xl border border-[#e7e3d8] overflow-hidden">
            {/* 月ナビゲーション */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e7e3d8]">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-lg hover:bg-[#f0ece0] transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-[#3d4a45]" />
              </button>
              <span className="text-sm font-bold text-[#10302a]">{formatMonthLabel(currentMonth)}</span>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg hover:bg-[#f0ece0] transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-[#3d4a45]" />
              </button>
            </div>

            {/* 曜日ヘッダー */}
            <div className="grid grid-cols-7 border-b border-[#e7e3d8]">
              {DAY_LABELS.map((d, i) => (
                <div
                  key={d}
                  className={`py-2 text-center text-xs font-semibold ${i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-[#6b7a73]"}`}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* カレンダーグリッド */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="h-14 border-b border-r border-[#f0ece0] last:border-r-0" />;
                }
                const dayStr = getDayStr(day);
                const events = eventsByDate[dayStr];
                const isToday = dayStr === todayStr;
                const isSelected = dayStr === selectedDay;
                const dow = idx % 7;

                return (
                  <button
                    key={dayStr}
                    onClick={() => setSelectedDay(isSelected ? null : dayStr)}
                    className={`h-14 border-b border-r border-[#f0ece0] last:border-r-0 flex flex-col items-center pt-1.5 pb-1 gap-0.5 transition-colors
                      ${isSelected ? "bg-[#174f3f]/10" : "hover:bg-[#f8f6ef]"}
                    `}
                  >
                    <span
                      className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full
                        ${isToday ? "bg-[#174f3f] text-white" : dow === 0 ? "text-red-500" : dow === 6 ? "text-blue-500" : "text-[#10302a]"}
                      `}
                    >
                      {day}
                    </span>
                    {events && (
                      <div className="flex gap-0.5 flex-wrap justify-center">
                        {events.siteVisits.length > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#174f3f]" />
                        )}
                        {events.nextActions.length > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#d9601a]" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 選択日の詳細 */}
          {selectedDay && selectedEvents && (
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-[#10302a]">
                {selectedDay.replace(/-/g, "/")} の予定
              </h2>
              {selectedEvents.siteVisits.length === 0 && selectedEvents.nextActions.length === 0 && (
                <p className="text-sm text-[#6b7a73] bg-white rounded-xl border border-[#e7e3d8] p-4 text-center">
                  この日の予定はありません
                </p>
              )}
              {selectedEvents.siteVisits.map((l) => (
                <EventCard key={`sv-${l.id}`} lead={l} type="site_visit" />
              ))}
              {selectedEvents.nextActions.map((l) => (
                <EventCard key={`na-${l.id}`} lead={l} type="next_action" />
              ))}
            </div>
          )}
        </>
      ) : (
        /* リスト表示 */
        <div className="space-y-6">
          {data.overdue.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                期限超過
              </h2>
              <div className="space-y-2">
                {data.overdue.map((l) => <LeadCard key={l.id} lead={l} />)}
              </div>
            </section>
          )}
          <section>
            <h2 className="text-sm font-bold text-[#10302a] mb-3">本日の予定</h2>
            {data.today.length === 0 ? (
              <p className="text-sm text-[#6b7a73] bg-white rounded-xl border border-[#e7e3d8] p-4 text-center">
                本日の予定はありません
              </p>
            ) : (
              <div className="space-y-2">
                {data.today.map((l) => <LeadCard key={l.id} lead={l} />)}
              </div>
            )}
          </section>
          {data.upcoming.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-[#10302a] mb-3">今後の予定</h2>
              <div className="space-y-2">
                {data.upcoming.map((l) => <LeadCard key={l.id} lead={l} />)}
              </div>
            </section>
          )}
          {data.siteVisits.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-[#10302a] mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#174f3f]" />
                現地見積もり予定
              </h2>
              <div className="space-y-2">
                {data.siteVisits.map((l) => (
                  <EventCard key={l.id} lead={l} type="site_visit" />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function LeadCard({ lead }: { lead: LeadWithCustomer }) {
  return (
    <Link
      href={`/admin/leads/${lead.id}`}
      className={`block bg-white rounded-xl border p-3 hover:bg-[#f8f6ef] transition-colors ${isPast(lead.next_action_at) ? "border-red-200" : "border-[#e7e3d8]"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-[#10302a]">{lead.customer.name} 様</p>
          <p className={`text-xs mt-0.5 flex items-center gap-1 ${isPast(lead.next_action_at) ? "text-red-600 font-semibold" : "text-[#6b7a73]"}`}>
            <Clock className="w-3 h-3" />
            {formatDate(lead.next_action_at)}
          </p>
          {lead.customer.city && (
            <p className="text-xs text-[#8a9a90] mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {lead.customer.prefecture} {lead.customer.city}
            </p>
          )}
        </div>
        <StatusBadge status={lead.status} />
      </div>
    </Link>
  );
}

function EventCard({ lead, type }: { lead: LeadWithCustomer; type: "site_visit" | "next_action" }) {
  const isSiteVisit = type === "site_visit";
  const dateStr = isSiteVisit ? lead.site_visit_at : lead.next_action_at;

  return (
    <Link
      href={`/admin/leads/${lead.id}`}
      className="block bg-white rounded-xl border border-[#e7e3d8] p-3 hover:bg-[#f8f6ef] transition-colors"
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${
            isSiteVisit
              ? "bg-[#174f3f]/10 text-[#174f3f]"
              : "bg-[#d9601a]/10 text-[#d9601a]"
          }`}
        >
          {isSiteVisit ? "現地見積もり" : "次回連絡"}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#10302a]">{lead.customer.name} 様</p>
          <p className="text-xs text-[#6b7a73] mt-0.5 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {dateStr ? toTimeStr(dateStr) : "—"}
          </p>
          {lead.customer.city && (
            <p className="text-xs text-[#8a9a90] mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {lead.customer.prefecture} {lead.customer.city}
            </p>
          )}
          <p className="text-xs text-[#8a9a90] mt-0.5">{lead.work_types.join("・")}</p>
        </div>
        <StatusBadge status={lead.status} />
      </div>
    </Link>
  );
}

function toTimeStr(iso: string) {
  return iso.slice(11, 16);
}
