import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { forbiddenResponse, requireAdofyAccess } from "@/lib/auth/adofyCheck";
import { MIGRATION_017_MESSAGE, candidateValuesToRow, isMissingColumn } from "@/lib/driverCandidates/admin";

/** 求職者を管理画面から手で登録する（電話・LINE などで受けた人）。adofy 管理者だけが使える */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  if (!(await requireAdofyAccess(supabase))) return forbiddenResponse();

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  const parsed = candidateValuesToRow(body);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const { data, error } = await createAdminClient()
    .from("driver_candidates")
    .insert({ ...parsed.row, source: "manual" })
    .select("id")
    .single();
  if (error) {
    console.error("[admin/driver-candidates] insert failed:", error.code, error.message);
    const msg = isMissingColumn(error.code) || error.code === "23514" ? MIGRATION_017_MESSAGE : "登録に失敗しました";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
  return NextResponse.json({ id: (data as { id: string }).id });
}
