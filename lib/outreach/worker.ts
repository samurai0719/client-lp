import type { SupabaseClient } from "@supabase/supabase-js";
import { TABLES } from "./constants";
import { enrichPending } from "./enrich";
import { syncInquiryLinks } from "./links";
import { processQueue, type QueueResult } from "./queue";
import { runJobStep, type JobRow } from "./sources";

/**
 * 営業メールのバックグラウンド処理を1回分まとめて進める。
 *   1. 送信キュー（最優先。テスト送信・一斉送信）
 *   2. 営業先の自動取得ジョブを1ページ分
 *   3. 公式HPの確認（メールアドレス取得）を数件
 *   4. 問い合わせとの紐付け（10分に1回程度）
 *
 * Vercel Cron（/api/cron/outreach）と、管理画面を開いている間の自動実行の両方から呼ぶ。
 * 同時に呼ばれても、送信は DB 側のロックとレート制限、取得ジョブは locked_until で二重処理しない。
 */

export type WorkerResult = {
  queue: QueueResult;
  jobs: { id: string; status: string; inserted: number }[];
  enriched: number;
  linked: number;
};

let lastLinkSync = 0;

export async function runWorker(
  db: SupabaseClient,
  opts: { budgetMs: number; stages?: ("queue" | "jobs" | "enrich" | "links")[] }
): Promise<WorkerResult> {
  const startedAt = Date.now();
  const deadline = startedAt + opts.budgetMs;
  const stages = new Set(opts.stages ?? ["queue", "jobs", "enrich", "links"]);
  const out: WorkerResult = { queue: { sent: 0, failed: 0, skipped: 0 }, jobs: [], enriched: 0, linked: 0 };

  if (stages.has("queue")) {
    // 送信に時間の半分まで使い、残りで取得・確認を進める
    out.queue = await processQueue(db, { deadline: startedAt + Math.floor(opts.budgetMs * 0.5) });
  }

  if (stages.has("jobs") && Date.now() < deadline - 15_000) {
    const { data } = await db
      .from(TABLES.jobs)
      .select("*")
      .in("status", ["queued", "running"])
      .order("created_at", { ascending: true })
      .limit(1);
    const job = (data as JobRow[] | null)?.[0];
    if (job) {
      const after = await runJobStep(db, job);
      out.jobs.push({ id: after.id, status: after.status, inserted: after.inserted_count });
    }
  }

  if (stages.has("enrich") && Date.now() < deadline - 12_000) {
    out.enriched = await enrichPending(db, { limit: 9, deadline: deadline - 10_000 });
  }

  if (stages.has("links") && Date.now() - lastLinkSync > 10 * 60_000 && Date.now() < deadline - 5_000) {
    lastLinkSync = Date.now();
    try {
      out.linked = (await syncInquiryLinks(db)).linked;
    } catch (err) {
      console.error("[outreach] link sync failed:", err instanceof Error ? err.message : err);
    }
  }

  return out;
}
