import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth/adminCheck";
import { sendPushToUser } from "@/lib/push/sendPush";

export async function POST() {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return unauthorizedResponse();

  await sendPushToUser(admin.user.id, {
    title: "テスト通知",
    body: "高長建設 顧客管理のテスト通知です",
    url: "/admin",
  });

  return NextResponse.json({ success: true });
}
