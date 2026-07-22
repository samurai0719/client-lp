// お問い合わせフォームで添付された写真を Supabase Storage（lead-images バケット）へ
// アップロードし、lead_images テーブルへ記録する共通処理。
// バケット自体の作成は supabase/migrations/003_lead_images_storage_bucket.sql を参照。

import type { SupabaseClient } from "@supabase/supabase-js";
import { ALLOWED_LEAD_IMAGE_TYPES, MAX_LEAD_IMAGE_FILES, MAX_LEAD_IMAGE_SIZE } from "./leadImageConstraints";

const BUCKET = "lead-images";

export type LeadImageType = "original" | "generated" | "estimate" | "construction" | "completion" | "other";

export type UploadLeadImagesResult = {
  uploaded: number;
  failed: number;
};

/** File[]をバリデーションのうえ lead-images バケットへアップロードし、lead_images へ記録する */
export async function uploadLeadImages(
  db: SupabaseClient,
  leadId: string,
  files: File[],
  imageType: LeadImageType = "original"
): Promise<UploadLeadImagesResult> {
  let uploaded = 0;
  let failed = 0;

  for (const file of files.slice(0, MAX_LEAD_IMAGE_FILES)) {
    if (!ALLOWED_LEAD_IMAGE_TYPES.includes(file.type) || file.size > MAX_LEAD_IMAGE_SIZE) {
      failed++;
      continue;
    }

    const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
    const path = `${leadId}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadErr } = await db.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false,
    });
    if (uploadErr) {
      console.error("[leadImages] upload failed:", uploadErr);
      failed++;
      continue;
    }

    const { error: insertErr } = await db.from("lead_images").insert({
      lead_id: leadId,
      image_type: imageType,
      storage_path: path,
      original_filename: file.name,
      mime_type: file.type,
      file_size: file.size,
    });
    if (insertErr) {
      console.error("[leadImages] DB insert failed:", insertErr);
      // アップロード済みファイルが孤立しないよう削除しておく
      await db.storage.from(BUCKET).remove([path]).catch(() => {});
      failed++;
      continue;
    }

    uploaded++;
  }

  return { uploaded, failed };
}

/** リクエストのFormDataから、指定フィールド名に含まれるFileだけを取り出す */
export function extractFilesFromFormData(form: FormData, fieldName: string): File[] {
  return form.getAll(fieldName).filter((v): v is File => v instanceof File && v.size > 0);
}
