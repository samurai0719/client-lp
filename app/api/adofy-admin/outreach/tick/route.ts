import { NextResponse } from "next/server";
import { authed } from "@/lib/outreach/api";
import { runWorker } from "@/lib/outreach/worker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** 管理画面を開いている間に定期的に呼ぶ（cron が無い環境でも送信・取得が進むように） */
export async function POST(req: Request) {
  const a = await authed(req);
  if ("error" in a) return a.error;
  const result = await runWorker(a.db, { budgetMs: 25_000 });
  return NextResponse.json(result);
}
