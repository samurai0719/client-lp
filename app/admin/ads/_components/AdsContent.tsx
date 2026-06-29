"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";
import { formatCurrency, formatDateOnly } from "@/lib/utils/format";
import { AD_PLATFORM_LABELS, type AdExpense, type AdPlatform } from "@/lib/types/crm";
import { mockAdExpenses, mockLeads } from "@/lib/mock/crmData";
import { shouldUseDemoData } from "@/lib/supabase/check";

interface PlatformStats {
  platform: AdPlatform | string;
  totalExpense: number;
  inquiryCount: number;
  contractCount: number;
  contractRevenue: number;
}

export default function AdsContent() {
  const [expenses, setExpenses] = useState<AdExpense[]>([]);
  const [stats, setStats] = useState<PlatformStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const emptyForm = { date: new Date().toISOString().slice(0, 10), platform: "meta" as AdPlatform, campaign_name: "", amount: "", memo: "" };
  const [form, setForm] = useState(emptyForm);

  async function load() {
    if (shouldUseDemoData()) {
      setExpenses(mockAdExpenses);
      const platforms = ["meta", "google", "tiktok"] as const;
      setStats(
        platforms.map((p) => {
          const exp = mockAdExpenses.filter((e) => e.platform === p);
          const totalExpense = exp.reduce((s, e) => s + e.amount, 0);
          const leads = mockLeads.filter((l) => l.source === p);
          const contracted = leads.filter((l) => ["contracted", "under_construction", "completed"].includes(l.status));
          return {
            platform: p,
            totalExpense,
            inquiryCount: leads.length,
            contractCount: contracted.length,
            contractRevenue: contracted.reduce((s, l) => s + (l.contract_amount ?? 0), 0),
          };
        }).filter((s) => s.totalExpense > 0 || s.inquiryCount > 0)
      );
      setLoading(false);
      return;
    }
    const res = await fetch("/api/admin/ads");
    if (res.ok) {
      const data = await res.json();
      setExpenses(data.expenses);
      setStats(data.stats);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!form.amount || Number(form.amount) <= 0) { alert("金額を入力してください"); return; }
    if (shouldUseDemoData()) { alert("デモモードです"); return; }
    const body = { ...form, amount: Number(form.amount), campaign_name: form.campaign_name || null, memo: form.memo || null };
    if (editId) {
      await fetch(`/api/admin/ads/${editId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    } else {
      await fetch("/api/admin/ads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    }
    setEditId(null);
    setShowForm(false);
    setForm(emptyForm);
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("この広告費データを削除しますか？")) return;
    if (shouldUseDemoData()) { alert("デモモードです"); return; }
    await fetch(`/api/admin/ads/${id}`, { method: "DELETE" });
    await load();
  }

  const inputClass = "w-full rounded-xl border border-[#dcd6c4] px-3 py-2 text-sm focus:outline-none focus:border-[#2f7d5a] focus:ring-2 focus:ring-[#2f7d5a]/20";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#10302a]">広告費管理</h1>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#174f3f] text-white text-sm font-medium hover:bg-[#1f6450] transition-colors"
        >
          <Plus className="w-4 h-4" />
          追加
        </button>
      </div>

      {shouldUseDemoData() && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
          デモデータ表示中（Supabase 未接続）
        </div>
      )}

      {/* 入力フォーム */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#e7e3d8] p-5 space-y-4">
          <h2 className="text-sm font-bold text-[#10302a]">{editId ? "編集" : "新規追加"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#6b7a73] mb-1">日付</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6b7a73] mb-1">媒体</label>
              <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value as AdPlatform })} className={inputClass}>
                {Object.entries(AD_PLATFORM_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6b7a73] mb-1">キャンペーン名</label>
              <input type="text" value={form.campaign_name} onChange={(e) => setForm({ ...form, campaign_name: e.target.value })} placeholder="外構LP_2024夏" className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6b7a73] mb-1">広告費（円）</label>
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="100000" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#6b7a73] mb-1">メモ</label>
              <input type="text" value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => { setShowForm(false); setEditId(null); }} className="px-4 py-2 rounded-xl border border-[#dcd6c4] text-sm text-[#3d4a45] hover:bg-[#f0ece0] transition-colors">
              <X className="w-4 h-4" />
            </button>
            <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#174f3f] text-white text-sm font-medium hover:bg-[#1f6450] transition-colors">
              <Save className="w-4 h-4" />
              保存
            </button>
          </div>
        </div>
      )}

      {/* 媒体別集計 */}
      {stats.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#e7e3d8] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#f0ece0]">
            <h2 className="text-sm font-bold text-[#10302a]">媒体別集計</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f0ece0] bg-[#f8f6ef]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#6b7a73]">媒体</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#6b7a73]">広告費</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#6b7a73]">問い合わせ数</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#6b7a73]">CPA</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#6b7a73]">成約数</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#6b7a73]">成約単価</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#6b7a73]">成約売上</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-[#6b7a73]">ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ece0]">
                {stats.map((s) => {
                  const cpa = s.inquiryCount > 0 ? Math.round(s.totalExpense / s.inquiryCount) : null;
                  const cpc = s.contractCount > 0 ? Math.round(s.totalExpense / s.contractCount) : null;
                  const roas = s.totalExpense > 0 ? Math.round((s.contractRevenue / s.totalExpense) * 100) : null;
                  return (
                    <tr key={String(s.platform)}>
                      <td className="px-4 py-3 font-medium text-[#10302a]">
                        {AD_PLATFORM_LABELS[s.platform as AdPlatform] ?? s.platform}
                      </td>
                      <td className="px-4 py-3 text-right text-[#3d4a45]">{formatCurrency(s.totalExpense)}</td>
                      <td className="px-4 py-3 text-right text-[#3d4a45]">{s.inquiryCount}件</td>
                      <td className="px-4 py-3 text-right text-[#3d4a45]">{cpa != null ? formatCurrency(cpa) : "—"}</td>
                      <td className="px-4 py-3 text-right text-[#3d4a45]">{s.contractCount}件</td>
                      <td className="px-4 py-3 text-right text-[#3d4a45]">{cpc != null ? formatCurrency(cpc) : "—"}</td>
                      <td className="px-4 py-3 text-right font-semibold text-[#174f3f]">{formatCurrency(s.contractRevenue)}</td>
                      <td className="px-4 py-3 text-right text-[#3d4a45]">{roas != null ? `${roas}%` : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 広告費一覧 */}
      <div className="bg-white rounded-2xl border border-[#e7e3d8] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f0ece0]">
          <h2 className="text-sm font-bold text-[#10302a]">広告費一覧</h2>
        </div>
        {loading ? (
          <div className="py-12 text-center text-sm text-[#6b7a73]">読み込み中...</div>
        ) : expenses.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#6b7a73]">広告費データがありません</div>
        ) : (
          <div className="divide-y divide-[#f0ece0]">
            {expenses.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between px-4 py-3 gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-[#10302a]">
                      {AD_PLATFORM_LABELS[exp.platform] ?? exp.platform}
                    </span>
                    {exp.campaign_name && (
                      <span className="text-xs text-[#6b7a73]">{exp.campaign_name}</span>
                    )}
                  </div>
                  <p className="text-xs text-[#8a9a90] mt-0.5">{formatDateOnly(exp.date)}{exp.memo && ` ・ ${exp.memo}`}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold text-[#174f3f]">{formatCurrency(exp.amount)}</span>
                  <button
                    onClick={() => {
                      setEditId(exp.id);
                      setForm({
                        date: exp.date,
                        platform: exp.platform,
                        campaign_name: exp.campaign_name ?? "",
                        amount: String(exp.amount),
                        memo: exp.memo ?? "",
                      });
                      setShowForm(true);
                    }}
                    className="p-1.5 text-[#8a9a90] hover:text-[#2f7d5a] rounded-lg hover:bg-[#f0ece0] transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="p-1.5 text-[#8a9a90] hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
