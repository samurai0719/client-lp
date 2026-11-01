// 企業向けLP（/shokunin-agent）のMeta Pixel。求職者LP（/shokunin-entry）には載せない。
// app/layout.tsx が別のPixelを init しているため、trackSingle でこのPixelにだけ送る。

export const SHOKUNIN_AGENT_PIXEL_ID = "1176745290758605";

export function fireShokuninAgentLead(): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("trackSingle", SHOKUNIN_AGENT_PIXEL_ID, "Lead");
}
