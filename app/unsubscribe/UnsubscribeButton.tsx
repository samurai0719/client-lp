"use client";

import { useState } from "react";

export default function UnsubscribeButton({ token, already }: { token: string; already: boolean }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(already ? "done" : "idle");

  async function submit() {
    setState("sending");
    try {
      const res = await fetch("/api/outreach/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ t: token }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
        配信を停止しました。今後ご案内メールはお送りしません。
      </p>
    );
  }
  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={submit}
        disabled={state === "sending"}
        className="w-full rounded-xl bg-slate-900 py-3.5 text-base font-bold text-white disabled:opacity-60"
      >
        {state === "sending" ? "処理中…" : "配信を停止する"}
      </button>
      {state === "error" && (
        <p className="mt-3 text-sm text-rose-600">処理に失敗しました。お手数ですが、メールへのご返信でお知らせください。</p>
      )}
    </div>
  );
}
