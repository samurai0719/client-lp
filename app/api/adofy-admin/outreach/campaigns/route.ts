import { NextResponse } from "next/server";
import { authed, bad, campaignFields } from "@/lib/outreach/api";
import { TABLES } from "@/lib/outreach/constants";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const a = await authed(req);
  if ("error" in a) return a.error;
  const f = campaignFields(a.body);
  if ("error" in f) return bad(f.error!);
  const { data, error } = await a.db.from(TABLES.campaigns).insert({ ...f.row, status: "draft" }).select("id").single();
  if (error) return bad("保存に失敗しました。migration 010 が適用されているか確認してください。", 500);
  return NextResponse.json({ id: (data as { id: string }).id });
}
