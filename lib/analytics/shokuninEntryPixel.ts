// 職人採用エージェントのMeta Pixel設定（求職者LP /shokunin-entry と企業向けLP /shokunin-agent で使う）。
// app/layout.tsx が別のPixelを init しているため、trackSingle でこのPixelにだけ送る。
// Lead は「APIが新規登録の保存成功を返した後」に呼ぶ（呼び出し側で1回に制御する）。

export const SHOKUNIN_ENTRY_PIXEL_ID = "1176745290758605";

export function fireShokuninEntryLead(): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("trackSingle", SHOKUNIN_ENTRY_PIXEL_ID, "Lead");
}
