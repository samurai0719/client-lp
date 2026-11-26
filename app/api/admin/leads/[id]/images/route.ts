import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { unauthorizedResponse } from "@/lib/auth/adminCheck";
import { leadBelongsTo, requireCrmAdmin } from "@/lib/crm/company";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = await requireCrmAdmin(supabase);
  if (!admin) return unauthorizedResponse();

  const db = createAdminClient();
  if (!(await leadBelongsTo(db, id, admin.company))) return NextResponse.json({ error: "見つかりません" }, { status: 404 });
  const { data: images } = await db.from("lead_images").select("*").eq("lead_id", id).order("created_at", { ascending: false });

  if (!images) return NextResponse.json({ images: [] });

  // 署名付きURL生成（60分有効）
  const imagesWithUrls = await Promise.all(
    images.map(async (img) => {
      const { data } = await db.storage.from("lead-images").createSignedUrl(img.storage_path, 3600);
      return { ...img, signed_url: data?.signedUrl ?? null };
    })
  );

  return NextResponse.json({ images: imagesWithUrls });
}
