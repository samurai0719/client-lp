import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { forbiddenResponse, requireAdofyAccess } from "@/lib/auth/adofyCheck";
import { COMPANY_STATUSES, MIGRATION_017_MESSAGE, isMissingColumn } from "@/lib/driverCandidates/admin";

type Params = { params: Promise<{ id: string }> };

/** 企業（申込み・問い合わせ）1件の更新：対応状況・契約済みかどうか・運営メモ。adofy 管理者だけが使える */
export async function PATCH(req: NextRequest, { params }: Params) {
  const supabase = await createClient();
  if (!(await requireAdofyAccess(supabase))) return forbiddenResponse();
  const { id } = await params;

  const body = (await req.json().catch(() => null)) as { status?: unknown; contracted?: unknown; staffMemo?: unknown } | null;
  if (!body) return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });

  const db = createAdminClient();
  const { data: current } = await db.from("driver_company_inquiries").select("*").eq("id", id).maybeSingle();
  if (!current) return NextResponse.json({ error: "見つかりませんでした" }, { status: 404 });

  const patch: Record<string, unknown> = {};
  if (body.status !== undefined) {
    if (typeof body.status !== "string" || !(COMPANY_STATUSES as readonly string[]).includes(body.status)) {
      return NextResponse.json({ error: "不正な対応状況です" }, { status: 400 });
    }
    patch.status = body.status;
  }
  if (typeof body.contracted === "boolean") {
    const was = Boolean((current as { contracted_at?: string | null }).contracted_at);
    if (body.contracted !== was) patch.contracted_at = body.contracted ? new Date().toISOString() : null;
  }
  if (body.staffMemo !== undefined) {
    const memo = typeof body.staffMemo === "string" ? body.staffMemo.replace(/\r\n?/g, "\n").trim().slice(0, 5000) : "";
    patch.staff_memo = memo || null;
  }
  if (Object.keys(patch).length === 0) return NextResponse.json({ ok: true });

  const { error } = await db.from("driver_company_inquiries").update(patch).eq("id", id);
  if (error) {
    console.error("[admin/driver-company-inquiries] update failed:", error.code, error.message);
    return NextResponse.json({ error: isMissingColumn(error.code) ? MIGRATION_017_MESSAGE : "保存に失敗しました" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
