import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { forbiddenResponse, requireAdofyAccess } from "@/lib/auth/adofyCheck";
import { MIGRATION_020_MESSAGE, SHOKUNIN_STATUSES, type ShokuninStatus } from "@/lib/shokuninCandidates/admin";

type Params = { params: Promise<{ id: string }> };

const UNDEFINED_COLUMN = new Set(["42703", "PGRST204"]);
const CHECK_VIOLATION = "23514";

/** 職人1人の対応状況・運営メモの更新。adofy 管理者だけが使える */
export async function PATCH(req: NextRequest, { params }: Params) {
  const supabase = await createClient();
  if (!(await requireAdofyAccess(supabase))) return forbiddenResponse();
  const { id } = await params;

  const body = (await req.json().catch(() => null)) as { status?: unknown; adminMemo?: unknown; contactedNow?: unknown } | null;
  if (!body || !SHOKUNIN_STATUSES.includes(body.status as ShokuninStatus) || typeof body.adminMemo !== "string") {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const { data, error } = await createAdminClient()
    .from("shokunin_candidates")
    .update({
      status: body.status,
      admin_memo: body.adminMemo.slice(0, 5000) || null,
      updated_at: now,
      ...(body.contactedNow === true ? { last_contacted_at: now } : {}),
    })
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error) {
    console.error("[admin/shokunin-candidates] update failed:", error.code, error.message);
    const needsMigration = UNDEFINED_COLUMN.has(error.code) || error.code === CHECK_VIOLATION;
    return NextResponse.json({ error: needsMigration ? MIGRATION_020_MESSAGE : "保存に失敗しました" }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "見つかりませんでした" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
