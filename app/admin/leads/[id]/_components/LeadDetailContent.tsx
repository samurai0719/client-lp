"use client";

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft, Phone, Mail, MapPin, ChevronDown, ChevronUp,
  Plus, Pencil, Trash2, Save, X, AlertTriangle, CheckCircle2
} from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatCurrency, formatDate, isPast } from "@/lib/utils/format";
import {
  LEAD_STATUSES, LEAD_STATUS_LABELS, ACTIVITY_TYPE_LABELS,
  LOST_REASON_OPTIONS, IMAGE_TYPE_LABELS,
  type LeadWithCustomer, type LeadActivity, type LeadNote,
  type LeadImage, type LeadStatus, type ActivityType,
} from "@/lib/types/crm";
import { mockLeads, mockActivities, mockNotes } from "@/lib/mock/crmData";
import { isSupabaseConfigured } from "@/lib/supabase/check";

interface Props { paramsPromise: Promise<{ id: string }> }

export default function LeadDetailContent({ paramsPromise }: Props) {
  const { id } = use(paramsPromise);
  const [lead, setLead] = useState<LeadWithCustomer | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [images, setImages] = useState<LeadImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [attrOpen, setAttrOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // 編集状態
  const [editStatus, setEditStatus] = useState<LeadStatus>("new");
  const [editEstimated, setEditEstimated] = useState("");
  const [editQuoted, setEditQuoted] = useState("");
  const [editContract, setEditContract] = useState("");
  const [editNextAction, setEditNextAction] = useState("");
  const [editSiteVisit, setEditSiteVisit] = useState("");
  const [editLostReason, setEditLostReason] = useState("");

  // メモ
  const [newNote, setNewNote] = useState("");
  const [editNoteId, setEditNoteId] = useState<string | null>(null);
  const [editNoteContent, setEditNoteContent] = useState("");

  // 活動
  const [actType, setActType] = useState<ActivityType>("call");
  const [actContent, setActContent] = useState("");

  const loadData = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      const found = mockLeads.find((l) => l.id === id) ?? mockLeads[0];
      setLead(found);
      setEditStatus(found.status);
      setEditEstimated(found.estimated_amount ? String(found.estimated_amount) : "");
      setEditQuoted(found.quoted_amount ? String(found.quoted_amount) : "");
      setEditContract(found.contract_amount ? String(found.contract_amount) : "");
      setEditNextAction(found.next_action_at ? found.next_action_at.slice(0, 16) : "");
      setEditSiteVisit(found.site_visit_at ? found.site_visit_at.slice(0, 16) : "");
      setEditLostReason(found.lost_reason ?? "");
      setActivities(mockActivities.filter((a) => a.lead_id === id));
      setNotes(mockNotes.filter((n) => n.lead_id === id));
      setLoading(false);
      return;
    }

    const [leadRes, actRes, noteRes, imgRes] = await Promise.all([
      fetch(`/api/admin/leads/${id}`),
      fetch(`/api/admin/leads/${id}/activities`),
      fetch(`/api/admin/leads/${id}/notes`),
      fetch(`/api/admin/leads/${id}/images`),
    ]);
    if (leadRes.ok) {
      const data = await leadRes.json();
      setLead(data.lead);
      setEditStatus(data.lead.status);
      setEditEstimated(data.lead.estimated_amount ? String(data.lead.estimated_amount) : "");
      setEditQuoted(data.lead.quoted_amount ? String(data.lead.quoted_amount) : "");
      setEditContract(data.lead.contract_amount ? String(data.lead.contract_amount) : "");
      setEditNextAction(data.lead.next_action_at ? data.lead.next_action_at.slice(0, 16) : "");
      setEditSiteVisit(data.lead.site_visit_at ? data.lead.site_visit_at.slice(0, 16) : "");
      setEditLostReason(data.lead.lost_reason ?? "");
    }
    if (actRes.ok) setActivities((await actRes.json()).activities ?? []);
    if (noteRes.ok) setNotes((await noteRes.json()).notes ?? []);
    if (imgRes.ok) setImages((await imgRes.json()).images ?? []);
    setLoading(false);
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleSaveDeal() {
    if (!isSupabaseConfigured()) { setMsg("デモモードです"); return; }
    setSaving(true);
    const prevStatus = lead?.status;
    if (editStatus === "contracted" && !editContract) {
      if (!confirm("成約金額が未入力です。このまま続けますか？")) { setSaving(false); return; }
    }
    if (editStatus === "lost" && !editLostReason) {
      alert("失注理由を入力してください");
      setSaving(false);
      return;
    }
    const body: Record<string, unknown> = {
      status: editStatus,
      estimated_amount: editEstimated ? Number(editEstimated) : null,
      quoted_amount: editQuoted ? Number(editQuoted) : null,
      contract_amount: editContract ? Number(editContract) : null,
      next_action_at: editNextAction || null,
      site_visit_at: editSiteVisit || null,
      lost_reason: editLostReason || null,
    };
    if (prevStatus !== editStatus) {
      body.status_changed_from = prevStatus;
    }
    const res = await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) { setMsg("保存しました"); await loadData(); }
    else { setMsg("保存に失敗しました"); }
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  }

  async function handleAddActivity() {
    if (!actContent.trim()) return;
    if (!isSupabaseConfigured()) { setMsg("デモモードです"); return; }
    const res = await fetch(`/api/admin/leads/${id}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activity_type: actType, content: actContent }),
    });
    if (res.ok) { setActContent(""); await loadData(); }
  }

  async function handleAddNote() {
    if (!newNote.trim()) return;
    if (!isSupabaseConfigured()) { setMsg("デモモードです"); return; }
    const res = await fetch(`/api/admin/leads/${id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newNote }),
    });
    if (res.ok) { setNewNote(""); await loadData(); }
  }

  async function handleEditNote(noteId: string) {
    if (!isSupabaseConfigured()) { setMsg("デモモードです"); return; }
    const res = await fetch(`/api/admin/leads/${id}/notes/${noteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editNoteContent }),
    });
    if (res.ok) { setEditNoteId(null); await loadData(); }
  }

  async function handleDeleteNote(noteId: string) {
    if (!confirm("このメモを削除しますか？")) return;
    if (!isSupabaseConfigured()) { setMsg("デモモードです"); return; }
    await fetch(`/api/admin/leads/${id}/notes/${noteId}`, { method: "DELETE" });
    await loadData();
  }

  async function handleDeleteImage(imgId: string) {
    if (!confirm("この画像を削除しますか？この操作は元に戻せません。")) return;
    if (!isSupabaseConfigured()) { setMsg("デモモードです"); return; }
    await fetch(`/api/admin/leads/${id}/images/${imgId}`, { method: "DELETE" });
    await loadData();
  }

  if (loading) {
    return <div className="py-16 text-center text-sm text-[#6b7a73]">読み込み中...</div>;
  }
  if (!lead) {
    return <div className="py-16 text-center text-sm text-[#6b7a73]">顧客が見つかりません</div>;
  }

  const sectionClass = "bg-white rounded-2xl border border-[#e7e3d8] p-5 space-y-4";
  const labelClass = "text-xs font-semibold text-[#6b7a73]";
  const valueClass = "text-sm text-[#10302a]";
  const inputClass = "w-full rounded-xl border border-[#dcd6c4] px-3 py-2 text-sm focus:outline-none focus:border-[#2f7d5a] focus:ring-2 focus:ring-[#2f7d5a]/20";

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/admin/leads" className="p-2 rounded-lg hover:bg-[#f0ece0] transition-colors">
          <ArrowLeft className="w-4 h-4 text-[#3d4a45]" />
        </Link>
        <h1 className="text-lg font-bold text-[#10302a]">{lead.customer.name} 様</h1>
        <StatusBadge status={lead.status} />
      </div>

      {!isSupabaseConfigured() && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
          デモデータ表示中（Supabase 未接続）
        </div>
      )}

      {/* 基本情報 */}
      <div className={sectionClass}>
        <h2 className="text-sm font-bold text-[#10302a]">基本情報</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <p className={labelClass}>顧客名</p>
            <p className={valueClass}>{lead.customer.name}</p>
          </div>
          <div>
            <p className={labelClass}>電話番号</p>
            <a href={`tel:${lead.customer.phone}`} className="text-sm text-[#2f7d5a] flex items-center gap-1 hover:underline">
              <Phone className="w-3 h-3" />
              {lead.customer.phone}
            </a>
          </div>
          {lead.customer.email && (
            <div>
              <p className={labelClass}>メール</p>
              <a href={`mailto:${lead.customer.email}`} className="text-sm text-[#2f7d5a] flex items-center gap-1 hover:underline truncate">
                <Mail className="w-3 h-3 shrink-0" />
                {lead.customer.email}
              </a>
            </div>
          )}
          {lead.customer.city && (
            <div>
              <p className={labelClass}>地域</p>
              <p className={`${valueClass} flex items-center gap-1`}>
                <MapPin className="w-3 h-3 text-[#8a9a90]" />
                {lead.customer.prefecture} {lead.customer.city}
              </p>
            </div>
          )}
          <div>
            <p className={labelClass}>受付日時</p>
            <p className={valueClass}>{formatDate(lead.created_at)}</p>
          </div>
          <div>
            <p className={labelClass}>流入元</p>
            <p className={valueClass}>{lead.source ?? "—"}</p>
          </div>
        </div>
      </div>

      {/* 問い合わせ情報 */}
      <div className={sectionClass}>
        <h2 className="text-sm font-bold text-[#10302a]">問い合わせ情報</h2>
        <div className="space-y-3">
          <div>
            <p className={labelClass}>希望工事</p>
            <p className={valueClass}>{lead.work_types.join("、") || "—"}</p>
          </div>
          {lead.design_style && (
            <div>
              <p className={labelClass}>デザイン</p>
              <p className={valueClass}>{lead.design_style}</p>
            </div>
          )}
          {lead.inquiry_message && (
            <div>
              <p className={labelClass}>問い合わせ内容</p>
              <p className="text-sm text-[#10302a] whitespace-pre-wrap bg-[#f8f6ef] rounded-xl p-3 mt-1">
                {lead.inquiry_message}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 画像 */}
      {images.length > 0 && (
        <div className={sectionClass}>
          <h2 className="text-sm font-bold text-[#10302a]">画像</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative group">
                {img.signed_url && (
                  <img
                    src={img.signed_url}
                    alt={img.original_filename ?? "画像"}
                    className="w-full aspect-square object-cover rounded-xl border border-[#e7e3d8]"
                  />
                )}
                <div className="absolute inset-0 flex flex-col items-end justify-end p-2 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs bg-black/60 text-white px-2 py-0.5 rounded-full">
                    {IMAGE_TYPE_LABELS[img.image_type] ?? img.image_type}
                  </span>
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="p-1 bg-red-500 text-white rounded-lg"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 商談管理 */}
      <div className={sectionClass}>
        <h2 className="text-sm font-bold text-[#10302a]">商談管理</h2>
        {msg && (
          <div className={`flex items-center gap-2 p-2 rounded-lg text-xs ${msg.includes("失敗") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            {msg.includes("失敗") ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
            {msg}
          </div>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={`${labelClass} block mb-1`}>ステータス</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as LeadStatus)}
              className={inputClass}
            >
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          {editStatus === "lost" && (
            <div className="sm:col-span-2">
              <label className={`${labelClass} block mb-1`}>失注理由</label>
              <select
                value={editLostReason}
                onChange={(e) => setEditLostReason(e.target.value)}
                className={inputClass}
              >
                <option value="">選択してください</option>
                {LOST_REASON_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className={`${labelClass} block mb-1`}>見込み金額</label>
            <input
              type="number"
              value={editEstimated}
              onChange={(e) => setEditEstimated(e.target.value)}
              placeholder="1200000"
              className={inputClass}
            />
            {editEstimated && <p className="text-xs text-[#6b7a73] mt-1">{formatCurrency(Number(editEstimated))}</p>}
          </div>
          <div>
            <label className={`${labelClass} block mb-1`}>見積金額</label>
            <input
              type="number"
              value={editQuoted}
              onChange={(e) => setEditQuoted(e.target.value)}
              placeholder="1200000"
              className={inputClass}
            />
            {editQuoted && <p className="text-xs text-[#6b7a73] mt-1">{formatCurrency(Number(editQuoted))}</p>}
          </div>
          <div>
            <label className={`${labelClass} block mb-1`}>成約金額</label>
            <input
              type="number"
              value={editContract}
              onChange={(e) => setEditContract(e.target.value)}
              placeholder="1200000"
              className={inputClass}
            />
            {editContract && <p className="text-xs text-[#6b7a73] mt-1">{formatCurrency(Number(editContract))}</p>}
          </div>
          <div>
            <label className={`${labelClass} block mb-1`}>次回連絡日時</label>
            <input
              type="datetime-local"
              value={editNextAction}
              onChange={(e) => setEditNextAction(e.target.value)}
              className={inputClass}
            />
            {editNextAction && isPast(editNextAction) && (
              <p className="text-xs text-red-600 mt-1">⚠ 期限を過ぎています</p>
            )}
          </div>
          <div>
            <label className={`${labelClass} block mb-1`}>現地見積もり日時</label>
            <input
              type="datetime-local"
              value={editSiteVisit}
              onChange={(e) => {
                setEditSiteVisit(e.target.value);
                if (e.target.value && editStatus !== "site_visit_scheduled" && editStatus !== "site_visit_completed") {
                  setEditStatus("site_visit_scheduled");
                }
              }}
              className={inputClass}
            />
            {editSiteVisit && (
              <p className="text-xs text-[#174f3f] mt-1">カレンダーに表示されます</p>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSaveDeal}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#174f3f] text-white text-sm font-semibold hover:bg-[#1f6450] disabled:opacity-60 transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? "保存中…" : "保存"}
          </button>
        </div>
      </div>

      {/* 対応履歴 */}
      <div className={sectionClass}>
        <h2 className="text-sm font-bold text-[#10302a]">対応履歴</h2>
        {/* 追加フォーム */}
        <div className="bg-[#f8f6ef] rounded-xl p-3 space-y-2">
          <div className="flex gap-2">
            <select
              value={actType}
              onChange={(e) => setActType(e.target.value as ActivityType)}
              className="px-3 py-2 rounded-lg border border-[#dcd6c4] text-xs focus:outline-none focus:border-[#2f7d5a] bg-white"
            >
              {Object.entries(ACTIVITY_TYPE_LABELS).map(([k, v]) => (
                k !== "inquiry_received" && k !== "status_changed" && (
                  <option key={k} value={k}>{v}</option>
                )
              ))}
            </select>
          </div>
          <textarea
            value={actContent}
            onChange={(e) => setActContent(e.target.value)}
            rows={2}
            placeholder="内容を入力…"
            className={`${inputClass} resize-none text-xs`}
          />
          <button
            onClick={handleAddActivity}
            disabled={!actContent.trim()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#174f3f] text-white text-xs font-medium disabled:opacity-40 hover:bg-[#1f6450] transition-colors"
          >
            <Plus className="w-3 h-3" />
            追加
          </button>
        </div>
        {/* 履歴一覧 */}
        <div className="space-y-2">
          {activities.length === 0 ? (
            <p className="text-xs text-[#6b7a73]">対応履歴はありません</p>
          ) : (
            activities.map((act) => (
              <div key={act.id} className="flex gap-3 text-xs">
                <div className="shrink-0 w-20 text-[#8a9a90] pt-0.5">{formatDate(act.created_at)}</div>
                <div>
                  <span className="font-semibold text-[#3d4a45]">[{ACTIVITY_TYPE_LABELS[act.activity_type] ?? act.activity_type}]</span>
                  <span className="text-[#3d4a45] ml-1 whitespace-pre-wrap">{act.content}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* メモ */}
      <div className={sectionClass}>
        <h2 className="text-sm font-bold text-[#10302a]">メモ</h2>
        <div className="space-y-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={2}
            placeholder="メモを追加…"
            className={`${inputClass} resize-none text-xs`}
          />
          <button
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#174f3f] text-white text-xs font-medium disabled:opacity-40 hover:bg-[#1f6450] transition-colors"
          >
            <Plus className="w-3 h-3" />
            メモを追加
          </button>
        </div>
        <div className="space-y-2">
          {notes.map((note) => (
            <div key={note.id} className="bg-[#f8f6ef] rounded-xl p-3">
              {editNoteId === note.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editNoteContent}
                    onChange={(e) => setEditNoteContent(e.target.value)}
                    rows={2}
                    className={`${inputClass} resize-none text-xs`}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleEditNote(note.id)} className="px-2 py-1 rounded-lg bg-[#174f3f] text-white text-xs">
                      <Save className="w-3 h-3" />
                    </button>
                    <button onClick={() => setEditNoteId(null)} className="px-2 py-1 rounded-lg border border-[#dcd6c4] text-xs">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-[#3d4a45] whitespace-pre-wrap">{note.content}</p>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => { setEditNoteId(note.id); setEditNoteContent(note.content); }}
                      className="p-1 text-[#8a9a90] hover:text-[#2f7d5a]"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleDeleteNote(note.id)} className="p-1 text-[#8a9a90] hover:text-red-500">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
              <p className="text-xs text-[#8a9a90] mt-1">{formatDate(note.created_at)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 広告流入 */}
      {lead.attribution && (
        <div className={sectionClass}>
          <button
            onClick={() => setAttrOpen(!attrOpen)}
            className="flex items-center justify-between w-full text-sm font-bold text-[#10302a]"
          >
            広告流入情報
            {attrOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {attrOpen && (
            <div className="grid grid-cols-2 gap-3 mt-2">
              {[
                ["utm_source", lead.attribution.utm_source],
                ["utm_medium", lead.attribution.utm_medium],
                ["utm_campaign", lead.attribution.utm_campaign],
                ["utm_content", lead.attribution.utm_content],
                ["utm_term", lead.attribution.utm_term],
                ["fbclid", lead.attribution.fbclid ? "あり" : null],
                ["gclid", lead.attribution.gclid ? "あり" : null],
                ["ttclid", lead.attribution.ttclid ? "あり" : null],
                ["landing_page", lead.attribution.landing_page],
                ["referrer", lead.attribution.referrer],
                ["device_type", lead.attribution.device_type],
              ].map(([k, v]) => v && (
                <div key={String(k)}>
                  <p className="text-xs text-[#8a9a90]">{k}</p>
                  <p className="text-xs text-[#3d4a45] break-all">{v}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* モバイル固定アクション */}
      <div className="fixed bottom-[calc(64px+env(safe-area-inset-bottom))] right-4 flex flex-col gap-2 lg:hidden">
        <a
          href={`tel:${lead.customer.phone}`}
          className="w-12 h-12 rounded-full bg-[#174f3f] text-white flex items-center justify-center shadow-lg"
        >
          <Phone className="w-5 h-5" />
        </a>
        {lead.customer.email && (
          <a
            href={`mailto:${lead.customer.email}`}
            className="w-12 h-12 rounded-full bg-[#d9601a] text-white flex items-center justify-center shadow-lg"
          >
            <Mail className="w-5 h-5" />
          </a>
        )}
      </div>
    </div>
  );
}
