import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth/adminCheck";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return unauthorizedResponse();

  const { searchParams } = request.nextUrl;
  const page = Number(searchParams.get("page") ?? 1);
  const perPage = Number(searchParams.get("per_page") ?? 20);
  const q = searchParams.get("q") ?? "";
  const status = searchParams.get("status") ?? "";
  const source = searchParams.get("source") ?? "";

  const db = createAdminClient();
  let query = db
    .from("leads")
    .select("*, customer:customers(*), attribution:lead_attribution(*)", { count: "exact" })
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (status) query = query.eq("status", status);
  if (source) query = query.eq("source", source);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: "取得に失敗しました" }, { status: 500 });
  }

  let leads = data ?? [];

  // フリーワード検索（サーバー側で簡易実装）
  if (q) {
    const lower = q.toLowerCase();
    leads = leads.filter(
      (l) =>
        l.customer?.name?.includes(q) ||
        l.customer?.phone?.includes(q) ||
        l.customer?.city?.includes(q) ||
        l.customer?.phone_normalized?.includes(lower.replace(/[^\d]/g, ""))
    );
  }

  return NextResponse.json({ leads, total: count ?? 0 });
}
