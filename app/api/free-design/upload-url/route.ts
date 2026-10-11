import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/check";
import { ALLOWED_UPLOAD_TYPES, MAX_UPLOAD_FILES, MAX_UPLOAD_SIZE, UPLOAD_BUCKET } from "@/lib/hpDesign/options";
import { isValidSubmissionId } from "@/lib/hpDesign/validate";
import { clientIp, rateLimited, sameOrigin } from "@/lib/hpDesign/server";

/**
 * 写真・ロゴのアップロード用に、署名付きアップロードURLを発行する。
 *
 * ファイル本体はブラウザから Supabase Storage へ直接送る（Vercel の4.5MB制限を避けるため）。
 * 保存先は申し込みごとのフォルダ pending/{submissionId}/ に固定し、
 * 形式・サイズは このAPI と バケット設定（migration 013）の二重で制限する。
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ERROR = "画像をアップロードできませんでした。写真がなくてもお申し込みいただけます。";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: ERROR }, { status: 403 });
  if (rateLimited(`upload:${clientIp(req)}`, 30, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "アップロードの回数が多すぎます。しばらくしてからお試しください。" }, { status: 429 });
  }

  let body: { submissionId?: unknown; type?: unknown; size?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: ERROR }, { status: 400 });
  }

  if (!isValidSubmissionId(body.submissionId)) return NextResponse.json({ error: ERROR }, { status: 400 });
  const type = typeof body.type === "string" ? body.type.toLowerCase() : "";
  const ext = ALLOWED_UPLOAD_TYPES[type];
  if (!ext) {
    return NextResponse.json({ error: "JPEG・PNG・WebP・HEIC形式の画像を選んでください。" }, { status: 400 });
  }
  const size = typeof body.size === "number" ? body.size : 0;
  if (size <= 0 || size > MAX_UPLOAD_SIZE) {
    return NextResponse.json({ error: "1枚あたり10MBまでの画像を選んでください。" }, { status: 400 });
  }

  if (!isSupabaseAdminConfigured()) return NextResponse.json({ error: ERROR }, { status: 500 });

  const db = createAdminClient();
  const folder = `pending/${body.submissionId.toLowerCase()}`;

  // 1件の申し込みで置けるファイル数を制限する
  const { data: existing, error: listError } = await db.storage.from(UPLOAD_BUCKET).list(folder, { limit: 100 });
  if (listError) {
    console.error("[free-design/upload-url] list failed:", listError.message);
    return NextResponse.json({ error: ERROR }, { status: 500 });
  }
  if ((existing?.length ?? 0) >= MAX_UPLOAD_FILES) {
    return NextResponse.json({ error: `アップロードできるのは${MAX_UPLOAD_FILES}枚までです。` }, { status: 400 });
  }

  const path = `${folder}/${randomUUID()}.${ext}`;
  const { data, error } = await db.storage.from(UPLOAD_BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    console.error("[free-design/upload-url] sign failed:", error?.message);
    return NextResponse.json({ error: ERROR }, { status: 500 });
  }

  return NextResponse.json({ path, token: data.token });
}
