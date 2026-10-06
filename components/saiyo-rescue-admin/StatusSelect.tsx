"use client";

import { useState } from "react";
import { LEAD_STATUSES, STATUS_LABEL, STATUS_STYLE, type LeadStatus } from "@/lib/saiyoRescue/leads";

/** ステータスをその場で変更するセレクト（色付き）。保存失敗時は元に戻す */
export default function StatusSelect({
  id,
  value,
  onChange,
  size = "sm",
}: {
  id: string;
  value: LeadStatus;
  onChange?: (v: LeadStatus) => void;
  size?: "sm" | "lg";
}) {
  const [status, setStatus] = useState<LeadStatus>(value);
  const [saving, setSaving] = useState(false);

  async function update(next: LeadStatus) {
    const prev = status;
    setStatus(next);
    setSaving(true);
    try {
      const res = await fetch(`/api/adofy-admin/saiyo-rescue/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
      onChange?.(next);
    } catch {
      setStatus(prev);
      alert("ステータスの保存に失敗しました");
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      aria-label="ステータス"
      value={status}
      disabled={saving}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => update(e.target.value as LeadStatus)}
      className={`cursor-pointer appearance-none rounded-full border-0 font-bold outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60 ${
        size === "lg" ? "px-4 py-2.5 text-base" : "px-3 py-1 text-xs"
      } ${STATUS_STYLE[status]}`}
    >
      {LEAD_STATUSES.map((s) => (
        <option key={s} value={s} className="bg-white text-slate-900">
          {STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}
