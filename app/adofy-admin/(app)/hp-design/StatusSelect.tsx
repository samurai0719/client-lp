"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STATUSES } from "@/lib/hpDesign/options";
import { STATUS_STYLES } from "@/lib/hpDesign/admin";

/** 一覧・詳細で使うステータス切り替え。失敗したら元の値に戻す */
export default function StatusSelect({ id, value, className }: { id: string; value: string; className?: string }) {
  const router = useRouter();
  const [current, setCurrent] = useState(value);
  const [saving, setSaving] = useState(false);

  const change = async (next: string) => {
    const prev = current;
    setCurrent(next);
    setSaving(true);
    try {
      const res = await fetch(`/api/adofy-admin/hp-design/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        setCurrent(prev);
        alert("ステータスの更新に失敗しました");
        return;
      }
      router.refresh();
    } catch {
      setCurrent(prev);
      alert("通信エラーで更新できませんでした");
    } finally {
      setSaving(false);
    }
  };

  return (
    <select
      value={current}
      disabled={saving}
      onChange={(e) => change(e.target.value)}
      aria-label="ステータス"
      className={`rounded-full border px-3 py-1.5 text-xs font-bold outline-none ${STATUS_STYLES[current] ?? className ?? ""}`}
    >
      {STATUSES.map((s) => (
        <option key={s.id} value={s.id}>{s.label}</option>
      ))}
    </select>
  );
}
