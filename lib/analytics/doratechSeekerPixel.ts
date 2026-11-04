// ドラテク 求職者向けLP（/driver・/driver/terms・/driver/privacy）のMeta Pixel。
// 求職者ページではこのPixelだけを発火させる（app/layout.tsx の共通Pixelは求職者ページでは読み込まない）。

export const DORATECH_SEEKER_PIXEL_ID = "1493747405297242";

/** 求職者の登録が完了した時点で1回送る */
export function fireDoratechSeekerLead(): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  try {
    window.fbq("trackSingle", DORATECH_SEEKER_PIXEL_ID, "Lead");
  } catch {
    // 計測失敗は握りつぶし、ユーザー操作を妨げない
  }
}
