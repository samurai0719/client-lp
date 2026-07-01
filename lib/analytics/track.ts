// 既存のGA4 / GTM / dataLayerが導入されている場合のみイベントを送信する。
// 未導入の環境では何もしない（二重発火や未定義エラーを避けるため）。

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

export function trackEvent(eventName: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;

  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
      return;
    }
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...params });
    }
  } catch {
    // 計測失敗は握りつぶし、ユーザー操作を妨げない
  }
}
