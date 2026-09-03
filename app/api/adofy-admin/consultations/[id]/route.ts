import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdofyAccess, forbiddenResponse } from "@/lib/auth/adofyCheck";

/** 相談1件の取得と更新（ステータス・次にやること） */

const STATUSES = ["new", "contacted", "in_progress", "won", "lost", "spam"] as const;
const STATUS_LABELS: Record<string, string> = {
  new: "新規",
  contacted: "連絡済み",
  in_progress: "商談中",
  won: "受注",
  lost: "失注",
  spam: "迷惑",
};

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const supabase = await createClient();
  const admin = await requireAdofyAccess(supabase);
  if (!admin) return forbiddenResponse();

  const { id } = await params;
  const db = createAdminClient();

  const [{ data: row, error }, { data: activities }] = await Promise.all([
    db.from("consultations").select("*").eq("id", id).single(),
    db
      .from("consultation_activities")
      .select("*")
      .eq("consultation_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (error || !row) {
    return NextResponse.json({ error: "見つかりませんでした" }, { status: 404 });
  }

  return NextResponse.json({ consultation: row, activities: activities ?? [] });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const supabase = await createClient();
  const admin = await requireAdofyAccess(supabase);
  if (!admin) return forbiddenResponse();

  const { id } = await params;

  let body: { status?: string; nextAction?: string | null; nextActionAt?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  const db = createAdminClient();
  const patch: Record<string, unknown> = {};

  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status as (typeof STATUSES)[number])) {
      return NextResponse.json({ error: "不正なステータスです" }, { status: 400 });
    }
    patch.status = body.status;
  }
  if (body.nextAction !== undefined) {
    patch.next_action = body.nextAction ? String(body.nextAction).slice(0, 200) : null;
  }
  if (body.nextActionAt !== undefined) {
    if (body.nextActionAt) {
      const d = new Date(body.nextActionAt);
      if (Number.isNaN(d.getTime())) {
        return NextResponse.json({ error: "日時の形式が正しくありません" }, { status: 400 });
      }
      patch.next_action_at = d.toISOString();
    } else {
      patch.next_action_at = null;
    }
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "更新する内容がありません" }, { status: 400 });
  }

  // 変更前のステータスを控えて、実際に変わった場合だけ履歴に残す
  const before = patch.status
    ? (await db.from("consultations").select("status").eq("id", id).single()).data
    : null;

  const { error } = await db.from("consultations").update(patch).eq("id", id);
  if (error) {
    console.error("[admin/consultations/:id] update failed:", error.code, error.message);
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  }

  if (before && before.status !== patch.status) {
    const from = STATUS_LABELS[before.status] ?? before.status;
    const to = STATUS_LABELS[patch.status as string] ?? patch.status;
    // 画面側がそのまま履歴へ追加できるよう、作成した記録を返す
    const { data: activity } = await db
      .from("consultation_activities")
      .insert({
        consultation_id: id,
        activity_type: "status",
        content: `ステータスを「${from}」から「${to}」に変更しました。`,
        created_by: admin.user.id,
      })
      .select("*")
      .single();
    return NextResponse.json({ success: true, activity });
  }

  return NextResponse.json({ success: true });
}
