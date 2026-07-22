// お問い合わせ系APIは「JSONのみ」「multipart/form-data（本文＋添付ファイル）」の
// どちらでも受け付けられるようにする共通パーサー。
// フォーム側は写真添付がある場合のみ multipart で送信し、フィールド本体は
// "payload" というJSON文字列フィールドに入れる（ファイルとテキストを1リクエストで送るため）。

import { extractFilesFromFormData } from "@/lib/storage/leadImages";

export async function parseJsonOrMultipart<T>(request: Request): Promise<{ body: T; files: File[] }> {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const payloadRaw = form.get("payload");
    const body = JSON.parse(typeof payloadRaw === "string" ? payloadRaw : "{}") as T;
    const files = extractFilesFromFormData(form, "images");
    return { body, files };
  }

  const body = (await request.json()) as T;
  return { body, files: [] };
}
