"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function JobActions({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function act(action: "pause" | "resume" | "cancel") {
    setBusy(true);
    await fetch(`/api/adofy-admin/outreach/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setBusy(false);
    router.refresh();
  }
  const b = "rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-bold text-slate-700 disabled:opacity-40";
  return (
    <span className="ml-auto flex gap-1.5">
      {(status === "queued" || status === "running") && <button disabled={busy} className={b} onClick={() => act("pause")}>一時停止</button>}
      {(status === "paused" || status === "failed") && <button disabled={busy} className={b} onClick={() => act("resume")}>再開</button>}
      {["queued", "running", "paused", "failed"].includes(status) && (
        <button disabled={busy} className={`${b} text-rose-600`} onClick={() => act("cancel")}>中止</button>
      )}
    </span>
  );
}
