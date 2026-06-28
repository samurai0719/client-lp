import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth/adminCheck";

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string; imageId: string }> }) {
  const { id, imageId } = await params;
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return unauthorizedResponse();

  const db = createAdminClient();

  const { data: img } = await db.from("lead_images").select("storage_path").eq("id", imageId).eq("lead_id", id).single();
  if (!img) return NextResponse.json({ error: "見つかりません" }, { status: 404 });

  // Storageから削除
  await db.storage.from("lead-images").remove([img.storage_path]);

  // DBから削除
  await db.from("lead_images").delete().eq("id", imageId);

  // 監査ログ
  await db.from("audit_logs").insert({
    user_id: admin.user.id,
    action: "image_deleted",
    target_type: "lead_images",
    target_id: imageId,
    metadata: {},
  });

  return NextResponse.json({ success: true });
}
