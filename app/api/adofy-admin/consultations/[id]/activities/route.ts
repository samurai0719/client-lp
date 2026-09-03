import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdofyAccess, forbiddenResponse } from "@/lib/auth/adofyCheck";

/** 対応履歴・メモの追加と削除 */

const TYPES = ["note", "call", "email", "meeting", "quote"] as const;

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const supabase = await createClient();
  const admin = await requireAdofyAccess(supabase);
  if (!admin) return forbiddenResponse();

  const { id } = await params;

  let body: { type?: string; content?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  const type = TYPES.includes(body.type as (typeof TYPES)[number]) ? body.type : "note";
  const content =
    typeof body.content === "string"
        ? body.content.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, 2000)
      : "";

  if (!content) {
    return NextResponse.json({ error: "内容を入力してください" }, { status: 400 });
  }

  const db = createAdminClient();
  const { data, error } = await db
    .from("consultation_activities")
    .insert({
      consultation_id: id,
      activity_type: type,
      content,
      created_by: admin.user.id,
    })
    .select("*")
    .single();

  if (error) {
    console.error("[consultation activities] insert failed:", error.code, error.message);
    return NextResponse.json({ error: "保存に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ activity: data });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const supabase = await createClient();
  const admin = await requireAdofyAccess(supabase);
  if (!admin) return forbiddenResponse();

  // ルートの一部として受け取るが、削除対象は activityId で特定する
  const { id } = await params;
  const activityId = req.nextUrl.searchParams.get("activityId");
  if (!activityId) {
    return NextResponse.json({ error: "IDが指定されていません" }, { status: 400 });
  }

  const db = createAdminClient();
  const { error } = await db
    .from("consultation_activities")
    .delete()
    .eq("id", activityId)
    .eq("consultation_id", id); // 別の相談の履歴を消せないようにする

  if (error) {
    console.error("[consultation activities] delete failed:", error.code, error.message);
    return NextResponse.json({ error: "削除に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
