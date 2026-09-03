// adofy（自社LP・相談フォーム）専用のMeta Pixel設定。
//
// ・このリポジトリは他社のLPも同居しており、app/layout.tsx が全ページ共通で
//   別のPixel（818193851340214）を init している。そのため adofy 側は
//   trackSingle を使い、adofyのPixelにだけイベントを送る。
//   （fbq('track') だと init 済みの全Pixelへ一斉送信されてしまう）
// ・PageView は components/analytics/AdofyMetaPixel.tsx が発火する。
// ・Lead は「APIレスポンスが成功した後」に1回だけ送る。ボタンクリック時には送らない。

export const ADOFY_PIXEL_ID = "3711341419004077";

type FbqFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: FbqFn;
  }
}

const isDev = process.env.NODE_ENV !== "production";

/**
 * adofyのPixelへ Lead イベントを送る。
 * 呼び出し側で「送信成功時に1回だけ」呼ぶこと（この関数自体は毎回送信する）。
 */
export function fireAdofyLead(source: string): void {
  if (typeof window === "undefined") return;

  if (typeof window.fbq !== "function") {
    // 開発環境ではPixel未読み込みでも実装確認ができるようログを出す
    if (isDev) {
      console.info(
        `[AdofyPixel:dev] fbqが未読み込みのため送信スキップ（本番では送信されます） source=${source} pixel=${ADOFY_PIXEL_ID}`
      );
    }
    return;
  }

  window.fbq("trackSingle", ADOFY_PIXEL_ID, "Lead");

  if (isDev) {
    console.info(`[AdofyPixel:dev] Lead送信 source=${source} pixel=${ADOFY_PIXEL_ID}`);
  }
}
