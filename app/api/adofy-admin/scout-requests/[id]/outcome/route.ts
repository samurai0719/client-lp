import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { forbiddenResponse, requireAdofyAccess } from "@/lib/auth/adofyCheck";
import { MIGRATION_017_MESSAGE, isMissingColumn } from "@/lib/driverCandidates/admin";

type Params = { params: Promise<{ id: string }> };

const DATE_FIELDS = { hiredAt: "hired_at", joinedAt: "joined_at", invoicedAt: "invoiced_at", paidAt: "paid_at" } as const;
const YEN_FIELDS = { annualSalary: "annual_salary", feeAmount: "fee_amount" } as const;

/**
 * 面接希望1件の採用結果と成功報酬の記録（運営の管理画面から）。adofy 管理者だけが使える。
 * 企業へのメールは送らない（請求書は別途送る）。
 * 「採用決定」にしたとき、求職者を「就職決定」にする（企業向けの一覧から外れる）。
 */
export async function PATCH(req: NextRequest, { params }: Params) {
  const supabase = await createClient();
  if (!(await requireAdofyAccess(supabase))) return forbiddenResponse();
  const { id } = await params;

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });

  const patch: Record<string, unknown> = {};
  const outcome = body.outcome === "" || body.outcome === null ? null : body.outcome;
  if (outcome !== null && outcome !== "hired" && outcome !== "not_hired") {
    return NextResponse.json({ error: "採用結果が正しくありません" }, { status: 400 });
  }
  patch.outcome = outcome;
  for (const [key, col] of Object.entries(DATE_FIELDS)) {
    const v = body[key];
    if (v === "" || v === null || v === undefined) patch[col] = null;
    else if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)) patch[col] = v;
    else return NextResponse.json({ error: "日付の形式が正しくありません" }, { status: 400 });
  }
  for (const [key, col] of Object.entries(YEN_FIELDS)) {
    const v = body[key];
    if (v === "" || v === null || v === undefined) patch[col] = null;
    else {
      const n = Number(String(v).replace(/[,，円\s]/g, ""));
      if (!Number.isInteger(n) || n < 0 || n > 100_000_000) return NextResponse.json({ error: "金額は0以上の整数（円）で入力してください" }, { status: 400 });
      patch[col] = n;
    }
  }
  const memo = typeof body.billingMemo === "string" ? body.billingMemo.replace(/\r\n?/g, "\n").trim().slice(0, 3000) : "";
  patch.billing_memo = memo || null;

  if (outcome === "hired" && !patch.hired_at) return NextResponse.json({ error: "採用決定日を入力してください" }, { status: 400 });
  if (patch.paid_at && !patch.invoiced_at) return NextResponse.json({ error: "入金日を入れる前に請求日を入力してください" }, { status: 400 });
  if ((patch.invoiced_at || patch.paid_at) && outcome !== "hired") {
    return NextResponse.json({ error: "請求・入金は「採用決定」のときだけ記録できます" }, { status: 400 });
  }

  const db = createAdminClient();
  const { data: current } = await db.from("scout_interview_requests").select("candidate_id, outcome").eq("id", id).maybeSingle();
  if (!current) return NextResponse.json({ error: "見つかりませんでした" }, { status: 404 });

  patch.updated_at = new Date().toISOString();
  const { error } = await db.from("scout_interview_requests").update(patch).eq("id", id);
  if (error) {
    console.error("[admin/scout-requests/outcome] update failed:", error.code, error.message);
    return NextResponse.json({ error: isMissingColumn(error.code) ? MIGRATION_017_MESSAGE : "保存に失敗しました" }, { status: 500 });
  }

  let candidateUpdated = false;
  const cur = current as { candidate_id: string; outcome?: string | null };
  if (outcome === "hired" && cur.outcome !== "hired") {
    const { error: cErr } = await db
      .from("driver_candidates")
      .update({ status: "hired", updated_at: new Date().toISOString() })
      .eq("id", cur.candidate_id)
      .neq("status", "withdrawn");
    if (cErr) console.error("[admin/scout-requests/outcome] candidate update failed:", cErr.code, cErr.message);
    else candidateUpdated = true;
  }
  return NextResponse.json({ ok: true, candidateUpdated });
}
