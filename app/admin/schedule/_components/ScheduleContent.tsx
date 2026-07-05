"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Calendar, List, ChevronLeft, ChevronRight,
  AlertCircle, MapPin, Clock, Plus, X, Search,
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatDate, formatPhone, isPast } from "@/lib/utils/format";
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
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

function toDateStr(iso: string) { return iso.slice(0, 10); }

function getJSTHour(iso: string) { return (new Date(iso).getUTCHours() + 9) % 24; }
function getJSTMinute(iso: string) { return new Date(iso).getUTCMinutes(); }
function fmtHM(h: number, m: number) {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function formatDayLabel(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00+09:00");
  return `${d.getMonth() + 1}月${d.getDate()}日（${DAY_LABELS[d.getDay()]}）`;
}

export default function ScheduleContent() {
  const todayStr = new Date().toISOString().slice(0, 10);

  const [data, setData] = useState<ScheduleData>({ siteVisits: [], overdue: [], today: [], upcoming: [] });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // モーダル
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState("");
  const [modalTime, setModalTime] = useState("10:00");
  const [modalSearch, setModalSearch] = useState("");
  const [modalResults, setModalResults] = useState<LeadWithCustomer[]>([]);
  const [modalSelected, setModalSelected] = useState<LeadWithCustomer | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    if (shouldUseDemoData()) {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayEnd = new Date(todayStart.getTime() + 86400000);
      const withNext = mockLeads.filter((l) => l.next_action_at);
      setData({
        siteVisits: mockLeads.filter((l) => l.site_visit_at),
        overdue: withNext.filter((l) => new Date(l.next_action_at!) < todayStart),
        today: withNext.filter((l) => { const d = new Date(l.next_action_at!); return d >= todayStart && d < todayEnd; }),
        upcoming: withNext.filter((l) => new Date(l.next_action_at!) >= todayEnd)
          .sort((a, b) => new Date(a.next_action_at!).getTime() - new Date(b.next_action_at!).getTime()),
      });
      setLoading(false);
      return;
    }
    const res = await fetch("/api/admin/schedule");
    if (res.ok) setData(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // 月カレンダーグリッド
  const calendarDays = useMemo(() => {
    const y = currentMonth.getFullYear(), m = currentMonth.getMonth();
    const firstDow = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [currentMonth]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, { sv: LeadWithCustomer[]; na: LeadWithCustomer[] }> = {};
    const ens = (d: string) => { if (!map[d]) map[d] = { sv: [], na: [] }; };
    for (const l of data.siteVisits) { if (l.site_visit_at) { ens(toDateStr(l.site_visit_at)); map[toDateStr(l.site_visit_at)].sv.push(l); } }
    for (const l of [...data.overdue, ...data.today, ...data.upcoming]) {
      if (l.next_action_at) { ens(toDateStr(l.next_action_at)); map[toDateStr(l.next_action_at)].na.push(l); }
    }
    return map;
  }, [data]);

  // 選択日のタイムスロット
  const daySlots = useMemo(() => {
    if (!selectedDay) return { byHour: {} as Record<number, LeadWithCustomer[]>, untimed: [] as LeadWithCustomer[] };
    const visits = data.siteVisits.filter((l) => l.site_visit_at && toDateStr(l.site_visit_at) === selectedDay);
    const byHour: Record<number, LeadWithCustomer[]> = {};
    const untimed: LeadWithCustomer[] = [];
    for (const l of visits) {
      if (!l.site_visit_at) continue;
      const h = getJSTHour(l.site_visit_at);
      const m = getJSTMinute(l.site_visit_at);
      if (h === 9 && m === 0) { untimed.push(l); continue; } // 日付のみ保存 → 時間未設定
      if (!byHour[h]) byHour[h] = [];
      byHour[h].push(l);
    }
    return { byHour, untimed };
  }, [data.siteVisits, selectedDay]);

  // モーダル内リード検索
  useEffect(() => {
    if (!modalOpen) return;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(async () => {
      if (shouldUseDemoData()) {
        setModalResults(
          modalSearch
            ? mockLeads.filter((l) => l.customer.name.includes(modalSearch) || l.customer.phone.includes(modalSearch)).slice(0, 6)
            : mockLeads.filter((l) => !l.site_visit_at).slice(0, 6)
        );
        return;
      }
      const p = new URLSearchParams({ per_page: "6" });
      if (modalSearch) p.set("q", modalSearch);
      const res = await fetch(`/api/admin/leads?${p}`);
      if (res.ok) setModalResults((await res.json()).leads ?? []);
    }, 300);
  }, [modalSearch, modalOpen]);

  function openModal(date: string, hour: number) {
    setModalDate(date);
    setModalTime(`${String(hour).padStart(2, "0")}:00`);
    setModalSearch("");
    setModalSelected(null);
    setModalResults([]);
    setSaveError("");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setModalSelected(null);
    setModalSearch("");
  }

  async function handleSave() {
    if (!modalSelected) return;
    setSaving(true);
    setSaveError("");
    try {
      const jst = new Date(`${modalDate}T${modalTime}:00+09:00`);
      const res = await fetch(`/api/admin/leads/${modalSelected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site_visit_at: jst.toISOString(), status: "site_visit_scheduled" }),
      });
      if (!res.ok) throw new Error();
      closeModal();
      await load();
    } catch {
      setSaveError("保存に失敗しました。もう一度お試しください。");
    } finally {
      setSaving(false);
    }
  }

  function getDayStr(day: number) {
    const y = currentMonth.getFullYear();
    const m = String(currentMonth.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}-${String(day).padStart(2, "0")}`;
  }

  if (loading) return <div className="py-16 text-center text-sm text-[#6b7a73]">読み込み中...</div>;

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#174f3f]" />
          <h1 className="text-xl font-bold text-[#10302a]">スケジュール</h1>
        </div>
        <div className="flex rounded-xl border border-[#e7e3d8] overflow-hidden text-xs font-semibold">
          <button onClick={() => setViewMode("calendar")} className={`flex items-center gap-1 px-3 py-2 transition-colors ${viewMode === "calendar" ? "bg-[#174f3f] text-white" : "bg-white text-[#6b7a73] hover:bg-[#f8f6ef]"}`}>
            <Calendar className="w-3.5 h-3.5" />カレンダー
          </button>
          <button onClick={() => setViewMode("list")} className={`flex items-center gap-1 px-3 py-2 transition-colors ${viewMode === "list" ? "bg-[#174f3f] text-white" : "bg-white text-[#6b7a73] hover:bg-[#f8f6ef]"}`}>
            <List className="w-3.5 h-3.5" />リスト
          </button>
        </div>
      </div>

      {shouldUseDemoData() && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
          デモデータ表示中（Supabase 未接続）
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-[#6b7a73]">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#174f3f] inline-block" />現地見積もり</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#d9601a] inline-block" />次回連絡</span>
      </div>

      {/* ── カレンダー表示 ── */}
      {viewMode === "calendar" && (
        <>
          <div className="bg-white rounded-2xl border border-[#e7e3d8] overflow-hidden">
            {/* 月ナビ */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e7e3d8]">
              <button onClick={() => { setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1)); setSelectedDay(null); }} className="p-1.5 rounded-lg hover:bg-[#f0ece0]">
                <ChevronLeft className="w-4 h-4 text-[#3d4a45]" />
              </button>
              <span className="text-sm font-bold text-[#10302a]">{currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月</span>
              <button onClick={() => { setCurrentMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1)); setSelectedDay(null); }} className="p-1.5 rounded-lg hover:bg-[#f0ece0]">
                <ChevronRight className="w-4 h-4 text-[#3d4a45]" />
              </button>
            </div>

            {/* 曜日 */}
            <div className="grid grid-cols-7 border-b border-[#e7e3d8]">
              {DAY_LABELS.map((d, i) => (
                <div key={d} className={`py-2 text-center text-xs font-semibold ${i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-[#6b7a73]"}`}>{d}</div>
              ))}
            </div>

            {/* 日グリッド */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                if (day === null) return <div key={`e-${idx}`} className="h-14 border-b border-r border-[#f0ece0]" />;
                const dayStr = getDayStr(day);
                const events = eventsByDate[dayStr];
                const isToday = dayStr === todayStr;
                const isSelected = dayStr === selectedDay;
                const dow = idx % 7;
                return (
                  <button
                    key={dayStr}
                    onClick={() => setSelectedDay(isSelected ? null : dayStr)}
                    className={`h-14 border-b border-r border-[#f0ece0] flex flex-col items-center pt-1.5 pb-1 gap-0.5 transition-colors ${isSelected ? "bg-[#174f3f]/10 ring-1 ring-inset ring-[#174f3f]/30" : "hover:bg-[#f8f6ef]"}`}
                  >
                    <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? "bg-[#174f3f] text-white" : dow === 0 ? "text-red-500" : dow === 6 ? "text-blue-500" : "text-[#10302a]"}`}>
                      {day}
                    </span>
                    {events && (
                      <div className="flex gap-0.5 flex-wrap justify-center">
                        {events.sv.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#174f3f]" />}
                        {events.na.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#d9601a]" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 選択日のタイムスケジュール（カレンダー直下に展開） ── */}
          {selectedDay && (
            <div className="bg-white rounded-2xl border border-[#e7e3d8] overflow-hidden">
              {/* 選択日ヘッダー */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#e7e3d8] bg-[#174f3f]/5">
                <span className="text-sm font-bold text-[#10302a]">{formatDayLabel(selectedDay)}</span>
                <button
                  onClick={() => openModal(selectedDay, 10)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#174f3f] text-white text-xs font-semibold hover:bg-[#1f6450] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />現地見積もりを追加
                </button>
              </div>

              {/* 時間未設定 */}
              {daySlots.untimed.length > 0 && (
                <div className="px-3 py-2 border-b border-[#f0ece0]">
                  <p className="text-xs font-semibold text-[#8a9a90] mb-1.5">時間未設定</p>
                  <div className="space-y-1.5">
                    {daySlots.untimed.map((l) => <DayEventCard key={l.id} lead={l} />)}
                  </div>
                </div>
              )}

              {/* タイムスロット */}
              {HOURS.map((hour) => {
                const events = daySlots.byHour[hour] ?? [];
                return (
                  <div key={hour} className="flex border-b border-[#f0ece0] last:border-b-0 min-h-[52px] group">
                    <div className="w-14 shrink-0 pt-3 px-3 text-xs font-semibold text-[#8a9a90] border-r border-[#f0ece0]">
                      {hour}:00
                    </div>
                    <div className="flex-1 p-2 space-y-1.5">
                      {events.map((l) => <DayEventCard key={l.id} lead={l} showTime />)}
                    </div>
                    <div className="shrink-0 flex items-start pt-2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openModal(selectedDay, hour)}
                        className="w-7 h-7 rounded-full bg-[#f0ece0] hover:bg-[#174f3f] hover:text-white text-[#174f3f] flex items-center justify-center transition-colors"
                        title={`${hour}:00 に追加`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!selectedDay && (
            <p className="text-xs text-center text-[#8a9a90]">日付をタップすると時間別スケジュールと追加ボタンが表示されます</p>
          )}
        </>
      )}

      {/* ── リスト表示 ── */}
      {viewMode === "list" && (
        <div className="space-y-6">
          {data.overdue.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-red-700 mb-3 flex items-center gap-2"><AlertCircle className="w-4 h-4" />期限超過</h2>
              <div className="space-y-2">{data.overdue.map((l) => <LeadCard key={l.id} lead={l} />)}</div>
            </section>
          )}
          <section>
            <h2 className="text-sm font-bold text-[#10302a] mb-3">本日の予定</h2>
            {data.today.length === 0 ? (
              <p className="text-sm text-[#6b7a73] bg-white rounded-xl border border-[#e7e3d8] p-4 text-center">本日の予定はありません</p>
            ) : (
              <div className="space-y-2">{data.today.map((l) => <LeadCard key={l.id} lead={l} />)}</div>
            )}
          </section>
          {data.upcoming.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-[#10302a] mb-3">今後の予定</h2>
              <div className="space-y-2">{data.upcoming.map((l) => <LeadCard key={l.id} lead={l} />)}</div>
            </section>
          )}
          {data.siteVisits.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-[#10302a] mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-[#174f3f]" />現地見積もり予定</h2>
              <div className="space-y-2">{data.siteVisits.map((l) => <EventCard key={l.id} lead={l} />)}</div>
            </section>
          )}
        </div>
      )}

      {/* ── 追加モーダル ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative w-full max-w-sm bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-5 space-y-4 mx-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#10302a]">現地見積もりを追加</h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-[#f0ece0]"><X className="w-4 h-4 text-[#6b7a73]" /></button>
            </div>

            {/* 日時 */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-[#6b7a73] mb-1">日付</label>
                <div className="px-3 py-2 rounded-xl border border-[#dcd6c4] bg-[#f8f6ef] text-sm text-[#10302a]">
                  {formatDayLabel(modalDate)}
                </div>
              </div>
              <div className="w-28">
                <label className="block text-xs font-semibold text-[#6b7a73] mb-1">時刻</label>
                <input
                  type="time"
                  value={modalTime}
                  onChange={(e) => setModalTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#dcd6c4] text-sm text-[#10302a] outline-none focus:border-[#2f7d5a] focus:ring-2 focus:ring-[#2f7d5a]/20"
                />
              </div>
            </div>

            {/* 顧客選択 */}
            <div>
              <label className="block text-xs font-semibold text-[#6b7a73] mb-1">顧客を選択</label>
              {modalSelected ? (
                <div className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-[#174f3f] bg-[#174f3f]/5">
                  <div>
                    <p className="text-sm font-semibold text-[#10302a]">{modalSelected.customer.name} 様</p>
                    <p className="text-xs text-[#6b7a73]">{formatPhone(modalSelected.customer.phone)}</p>
                  </div>
                  <button onClick={() => setModalSelected(null)} className="p-1 rounded hover:bg-[#f0ece0]">
                    <X className="w-3.5 h-3.5 text-[#6b7a73]" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8a9a90]" />
                    <input
                      type="text"
                      placeholder="名前・電話番号で検索"
                      value={modalSearch}
                      onChange={(e) => setModalSearch(e.target.value)}
                      autoFocus
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#dcd6c4] text-sm outline-none focus:border-[#2f7d5a] focus:ring-2 focus:ring-[#2f7d5a]/20"
                    />
                  </div>
                  {modalResults.length > 0 && (
                    <div className="border border-[#e7e3d8] rounded-xl overflow-hidden max-h-44 overflow-y-auto">
                      {modalResults.map((l) => (
                        <button key={l.id} onClick={() => setModalSelected(l)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#f8f6ef] transition-colors border-b border-[#f0ece0] last:border-b-0 text-left"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#10302a] truncate">{l.customer.name} 様</p>
                            <p className="text-xs text-[#6b7a73]">{formatPhone(l.customer.phone)}</p>
                          </div>
                          <StatusBadge status={l.status} />
                        </button>
                      ))}
                    </div>
                  )}
                  {modalSearch && modalResults.length === 0 && (
                    <p className="text-xs text-center text-[#8a9a90] py-2">該当する顧客が見つかりません</p>
                  )}
                </div>
              )}
            </div>

            {saveError && <p className="text-xs text-red-600">{saveError}</p>}

            <div className="flex gap-2 pt-1">
              <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-[#e7e3d8] text-sm text-[#6b7a73] hover:bg-[#f8f6ef] transition-colors">
                キャンセル
              </button>
              <button onClick={handleSave} disabled={!modalSelected || saving}
                className="flex-1 py-2.5 rounded-xl bg-[#174f3f] text-white text-sm font-semibold hover:bg-[#1f6450] disabled:opacity-50 transition-colors"
              >
                {saving ? "保存中…" : "追加する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DayEventCard({ lead, showTime }: { lead: LeadWithCustomer; showTime?: boolean }) {
  const h = lead.site_visit_at ? getJSTHour(lead.site_visit_at) : null;
  const m = lead.site_visit_at ? getJSTMinute(lead.site_visit_at) : null;
  return (
    <Link href={`/admin/leads/${lead.id}`}
      className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#174f3f]/8 border border-[#174f3f]/20 hover:bg-[#174f3f]/15 transition-colors"
    >
      {showTime && h !== null && m !== null && (
        <span className="text-xs font-bold text-[#174f3f] w-10 shrink-0">{fmtHM(h, m)}</span>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#10302a] truncate">{lead.customer.name} 様</p>
        <p className="text-xs text-[#6b7a73] truncate">{lead.work_types.join("・")}</p>
      </div>
      {lead.customer.city && (
        <p className="text-xs text-[#8a9a90] flex items-center gap-0.5 shrink-0">
          <MapPin className="w-3 h-3" />{lead.customer.city}
        </p>
      )}
    </Link>
  );
}

function LeadCard({ lead }: { lead: LeadWithCustomer }) {
  return (
    <Link href={`/admin/leads/${lead.id}`}
      className={`block bg-white rounded-xl border p-3 hover:bg-[#f8f6ef] transition-colors ${isPast(lead.next_action_at) ? "border-red-200" : "border-[#e7e3d8]"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-[#10302a]">{lead.customer.name} 様</p>
          <p className={`text-xs mt-0.5 flex items-center gap-1 ${isPast(lead.next_action_at) ? "text-red-600 font-semibold" : "text-[#6b7a73]"}`}>
            <Clock className="w-3 h-3" />{formatDate(lead.next_action_at)}
          </p>
          {lead.customer.city && (
            <p className="text-xs text-[#8a9a90] mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" />{lead.customer.prefecture} {lead.customer.city}
            </p>
          )}
        </div>
        <StatusBadge status={lead.status} />
      </div>
    </Link>
  );
}

function EventCard({ lead }: { lead: LeadWithCustomer }) {
  const dateStr = lead.site_visit_at;
  return (
    <Link href={`/admin/leads/${lead.id}`} className="block bg-white rounded-xl border border-[#e7e3d8] p-3 hover:bg-[#f8f6ef] transition-colors">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 text-xs font-bold px-2 py-0.5 rounded-full bg-[#174f3f]/10 text-[#174f3f]">現地見積もり</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#10302a]">{lead.customer.name} 様</p>
          {dateStr && (
            <p className="text-xs text-[#6b7a73] mt-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3" />{toDateStr(dateStr)} {fmtHM(getJSTHour(dateStr), getJSTMinute(dateStr))}
            </p>
          )}
          {lead.customer.city && (
            <p className="text-xs text-[#8a9a90] mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" />{lead.customer.prefecture} {lead.customer.city}
            </p>
          )}
          <p className="text-xs text-[#8a9a90] mt-0.5">{lead.work_types.join("・")}</p>
        </div>
        <StatusBadge status={lead.status} />
      </div>
    </Link>
  );
}
