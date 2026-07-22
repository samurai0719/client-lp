// 添付写真のバリデーション定数。クライアント（フォーム）・サーバー（アップロード処理）の
// 両方から使うため、Supabaseクライアントに依存しないこのファイルに切り出す。

export const MAX_LEAD_IMAGE_FILES = 5;
export const MAX_LEAD_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_LEAD_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "application/pdf",
];
