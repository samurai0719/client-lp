"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SuppressionAdd() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  async function add() {
    setMsg(null);
    const res = await fetch("/api/adofy-admin/outreach/suppressions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const j = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) return setMsg(j.error ?? "追加に失敗しました");
    setEmail("");
    setMsg("追加しました");
    router.refresh();
  }
  return (
    <div className="flex flex-wrap gap-2">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="送信を断られたアドレス"
        className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-base sm:text-sm"
      />
      <button type="button" onClick={add} disabled={!email} className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-40">
        配信停止に追加
      </button>
      {msg && <p className="w-full text-xs font-bold text-slate-600">{msg}</p>}
    </div>
  );
}
