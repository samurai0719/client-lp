import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth/adminCheck";

/**
 * adofy 無料相談リードの一覧取得・ステータス更新。
 * 既存の /api/admin/leads と同じく、管理者セッションを検証してから
 * service role で読み書きする（ブラウザから Supabase へは直接触らせない）。
 */

const STATUSES = ["new", "contacted", "in_progress", "won", "lost", "spam"] as const;

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return unauthorizedResponse();

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const perPage = Math.min(100, Math.max(1, Number(searchParams.get("per_page") ?? 20)));
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const status = searchParams.get("status") ?? "";

  const db = createAdminClient();
  let query = db
    .from("consultations")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (status && STATUSES.includes(status as (typeof STATUSES)[number])) {
    query = query.eq("status", status);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error("[admin/consultations] select failed:", error.code, error.message);
    return NextResponse.json({ error: "取得に失敗しました" }, { status: 500 });
  }

  let rows = data ?? [];

  // フリーワード検索（会社名・担当者・電話・メール）
  if (q) {
    rows = rows.filter((r) =>
      [r.company_name, r.contact_name, r.phone, r.email, r.prefecture]
        .filter(Boolean)
        .some((v: string) => String(v).toLowerCase().includes(q))
    );
  }

  return NextResponse.json({ consultations: rows, total: count ?? rows.length });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return unauthorizedResponse();

  let body: { id?: string; status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
  }

  const { id, status } = body;
  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "IDが指定されていません" }, { status: 400 });
  }
  if (!status || !STATUSES.includes(status as (typeof STATUSES)[number])) {
    return NextResponse.json({ error: "不正なステータスです" }, { status: 400 });
  }

  const db = createAdminClient();
  const { error } = await db.from("consultations").update({ status }).eq("id", id);

  if (error) {
    console.error("[admin/consultations] update failed:", error.code, error.message);
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
