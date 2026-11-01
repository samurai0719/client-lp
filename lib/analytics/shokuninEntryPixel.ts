// 求職者LP（/shokunin-entry）のMeta Pixel。求職者用のIDを受け取ったらここに入れる（空の間は何も読み込まず、Lead も送らない）。
// 企業向けのPixelと混ぜないこと。

export const SHOKUNIN_ENTRY_PIXEL_ID: string = "";

export function fireShokuninEntryLead(): void {
  if (!SHOKUNIN_ENTRY_PIXEL_ID || typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("trackSingle", SHOKUNIN_ENTRY_PIXEL_ID, "Lead");
}
