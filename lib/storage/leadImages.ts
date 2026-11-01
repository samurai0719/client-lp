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

const HEIC_BRANDS = ["heic", "heix", "hevc", "hevx", "heif", "mif1", "msf1"];

/** ブラウザ申告の file.type は偽装できるため、ファイル先頭のバイト列で実際の形式を判定する */
function detectLeadFileType(bytes: Uint8Array): { mime: string; ext: string } | null {
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.subarray(start, end));
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return { mime: "image/jpeg", ext: "jpg" };
  if (ascii(0, 8) === "\x89PNG\r\n\x1a\n") return { mime: "image/png", ext: "png" };
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return { mime: "image/webp", ext: "webp" };
  if (ascii(4, 8) === "ftyp" && HEIC_BRANDS.includes(ascii(8, 12))) return { mime: "image/heic", ext: "heic" };
  if (ascii(0, 5) === "%PDF-") return { mime: "application/pdf", ext: "pdf" };
  return null;
}

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
    if (file.size > MAX_LEAD_IMAGE_SIZE) {
      failed++;
      continue;
    }

    const detected = detectLeadFileType(new Uint8Array(await file.slice(0, 16).arrayBuffer()));
    if (!detected || !ALLOWED_LEAD_IMAGE_TYPES.includes(detected.mime)) {
      failed++;
      continue;
    }

    const path = `${leadId}/${crypto.randomUUID()}.${detected.ext}`;

    const { error: uploadErr } = await db.storage.from(BUCKET).upload(path, file, {
      contentType: detected.mime,
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
      original_filename: file.name.slice(0, 255),
      mime_type: detected.mime,
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
