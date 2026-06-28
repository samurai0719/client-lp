import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth/adminCheck";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return unauthorizedResponse();

  const { endpoint } = await request.json();
  if (!endpoint) return NextResponse.json({ error: "endpointが必要です" }, { status: 400 });

  const db = createAdminClient();
  await db.from("push_subscriptions").update({ is_active: false, updated_at: new Date().toISOString() }).eq("endpoint", endpoint).eq("user_id", admin.user.id);

  return NextResponse.json({ success: true });
}
