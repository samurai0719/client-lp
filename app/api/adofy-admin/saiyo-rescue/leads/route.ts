import { NextResponse } from "next/server";
import { forbiddenResponse } from "@/lib/auth/adofyCheck";
import { getAuthorizedLeadsDb } from "@/lib/saiyoRescue/adminAccess";
import { LEADS_TABLE } from "@/lib/saiyoRescue/leads";

export const dynamic = "force-dynamic";

/** 問い合わせ一覧（新しい順・最大2000件） */
export async function GET() {
  const auth = await getAuthorizedLeadsDb();
  if (!auth) return forbiddenResponse();

  const { data, error } = await auth.db
    .from(LEADS_TABLE)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(2000);

  if (error) {
    console.error("[saiyo-rescue admin] list failed:", error.code, error.message);
    return NextResponse.json({ error: "読み込みに失敗しました" }, { status: 500 });
  }
  return NextResponse.json({ leads: data ?? [] });
}
