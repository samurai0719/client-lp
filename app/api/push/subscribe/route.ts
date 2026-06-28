import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth/adminCheck";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return unauthorizedResponse();

  const { endpoint, p256dh, auth, userAgent, deviceName } = await request.json();
  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ error: "購読情報が不足しています" }, { status: 400 });
  }

  const db = createAdminClient();
  await db.from("push_subscriptions").upsert(
    {
      user_id: admin.user.id,
      endpoint,
      p256dh,
      auth,
      user_agent: userAgent ?? null,
      device_name: deviceName ?? null,
      is_active: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "endpoint" }
  );

  return NextResponse.json({ success: true });
}
