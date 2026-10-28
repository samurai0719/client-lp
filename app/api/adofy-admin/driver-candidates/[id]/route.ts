import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { forbiddenResponse, requireAdofyAccess } from "@/lib/auth/adofyCheck";
import { MIGRATION_017_MESSAGE, candidateValuesToRow, isMissingColumn } from "@/lib/driverCandidates/admin";

type Params = { params: Promise<{ id: string }> };

/** 求職者1人の更新（状態・匿名プロフィール・個人情報・運営メモ）。adofy 管理者だけが使える */
export async function PATCH(req: NextRequest, { params }: Params) {
  const supabase = await createClient();
  if (!(await requireAdofyAccess(supabase))) return forbiddenResponse();
  const { id } = await params;

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  const parsed = candidateValuesToRow(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { data, error } = await createAdminClient()
    .from("driver_candidates")
    .update({ ...parsed.row, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")
    .maybeSingle();
  if (error) {
    console.error("[admin/driver-candidates] update failed:", error.code, error.message);
    const msg = isMissingColumn(error.code) || error.code === "23514" ? MIGRATION_017_MESSAGE : "保存に失敗しました";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "見つかりませんでした" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
