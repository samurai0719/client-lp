"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";

type TickResult = {
  queue: { sent: number; failed: number; skipped: number; blocked?: string[] };
  jobs: { id: string; status: string; inserted: number }[];
  enriched: number;
  linked: number;
};

const KEY = "outreach_worker_on";
const INTERVAL_MS = 20_000;

// ON/OFF はこのブラウザだけの設定（localStorage）。使えない環境では常に ON
const listeners = new Set<() => void>();
function readOn(): boolean {
  try {
    return localStorage.getItem(KEY) !== "0";
  } catch {
    return true;
  }
}
function writeOn(v: boolean) {
  try {
    localStorage.setItem(KEY, v ? "1" : "0");
  } catch {
    /* noop */
  }
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

/**
 * 管理画面を開いている間、バックグラウンド処理（送信キュー・営業先取得・HP確認）を定期的に進める。
 * cron を設定していない環境でも、画面を開いていれば処理が進む。
 * 1回の処理が終わってから次を呼ぶので、同じタブから重複して実行されることはない。
 */
export default function WorkerRunner() {
  const router = useRouter();
  const on = useSyncExternalStore(subscribe, readOn, () => true);
  const [last, setLast] = useState<{ at: Date; r: TickResult } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const running = useRef(false);

  useEffect(() => {
    if (!on) return;
    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    async function tick() {
      if (cancelled) return;
      if (document.visibilityState === "visible" && !running.current) {
        running.current = true;
        try {
          const res = await fetch("/api/adofy-admin/outreach/tick", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
          if (res.ok) {
            const r = (await res.json()) as TickResult;
            setLast({ at: new Date(), r });
            setError(null);
            const changed = r.queue.sent + r.queue.failed + r.queue.skipped + r.enriched + r.linked + r.jobs.reduce((n, j) => n + j.inserted, 0);
            if (changed > 0) router.refresh();
          } else {
            setError(`自動処理に失敗しました（${res.status}）`);
          }
        } catch {
          setError("自動処理に接続できませんでした");
        } finally {
          running.current = false;
        }
      }
      if (!cancelled) timer = setTimeout(tick, INTERVAL_MS);
    }
    timer = setTimeout(tick, 1500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [on, router]);

  function toggle() {
    writeOn(!on);
  }

  const r = last?.r;
  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
      <button
        type="button"
        onClick={toggle}
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-bold ${on ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
      >
        <span className={`h-2 w-2 rounded-full ${on ? "animate-pulse bg-emerald-500" : "bg-slate-400"}`} />
        自動処理 {on ? "ON" : "OFF"}
      </button>
      {error && <span className="font-bold text-rose-600">{error}</span>}
      {r && !error && (
        <span>
          {last!.at.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit", second: "2-digit" })} 送信{r.queue.sent}件・エラー{r.queue.failed}件・HP確認{r.enriched}件
          {r.jobs[0] ? `・取得ジョブ進行中` : ""}
        </span>
      )}
      {r?.queue.blocked && r.queue.blocked.length > 0 && (
        <span className="font-bold text-amber-700">送信停止中：{r.queue.blocked[0]}</span>
      )}
      <span className="ml-auto hidden sm:inline">画面を開いている間、送信・取得・HP確認を少しずつ進めます</span>
    </div>
  );
}
