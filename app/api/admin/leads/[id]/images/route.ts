import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth/adminCheck";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  if (!await requireAdmin(supabase)) return unauthorizedResponse();

  const db = createAdminClient();
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
