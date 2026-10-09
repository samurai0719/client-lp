import { NextResponse } from "next/server";
import { authed, bad, UUID } from "@/lib/outreach/api";
import { TABLES } from "@/lib/outreach/constants";

export const dynamic = "force-dynamic";

/** 取得ジョブの一時停止・再開・中止 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const a = await authed(req);
  if ("error" in a) return a.error;
  const { id } = await params;
  if (!UUID.test(id)) return bad("不正なIDです");
  const action = String(a.body.action ?? "");
  const map: Record<string, { from: string[]; to: string }> = {
    pause: { from: ["queued", "running"], to: "paused" },
    resume: { from: ["paused", "failed"], to: "queued" },
    cancel: { from: ["queued", "running", "paused", "failed"], to: "cancelled" },
  };
  const m = map[action];
  if (!m) return bad("操作が不正です");
  const { data } = await a.db
    .from(TABLES.jobs)
    .update({ status: m.to, locked_until: null, updated_at: new Date().toISOString() })
    .eq("id", id)
    .in("status", m.from)
    .select("id");
  if (!data?.length) return bad("この状態では操作できません", 409);
  return NextResponse.json({ ok: true });
}
