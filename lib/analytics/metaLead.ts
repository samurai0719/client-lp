// Meta Pixel の Lead イベント送信（高長建設LP・診断フォーム用）。
//
// ・PageView は app/layout.tsx（818193851340214）と
//   components/analytics/TakanagaMetaPixel.tsx（533491373010800）が発火する。既存のまま変更しない。
// ・Lead は「APIレスポンスが成功した後」に、この関数を1回だけ呼ぶ。
//   ボタンクリック時・入力確認時には呼ばないこと。
// ・呼び出し側は useRef 等で発火済み管理を行い、二重クリック・再レンダリング・
//   戻る操作での重複発火を防ぐ（この関数自体は毎回送信する）。
// ・eventID には送信ペイロードと同じ eventId を渡す。将来 CAPI（サーバー側送信）を
//   併用する場合、同じ event_id を使えば Meta 側で重複除外される。

const META_PIXEL_IDS = ["818193851340214", "533491373010800"] as const;

type FbqFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: FbqFn;
  }
}

const isDev = process.env.NODE_ENV !== "production";

/** 送信直前に生成してAPIペイロードにも含める（CAPI重複除外用） */
export function generateLeadEventId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

/**
 * 両方のMeta PixelへLeadイベントを送信する。
 * trackSingle を使い、それぞれのPixelに1回ずつだけ送る（fbq('track')だと
 * 初期化済みの全Pixelへ一斉送信され、制御できないため使わない）。
 */
export function fireMetaLead(eventId: string, source: string): void {
  if (typeof window === "undefined") return;

  if (typeof window.fbq !== "function") {
    // 開発環境ではPixel未読み込みでも実装確認ができるようログを出す
    if (isDev) {
      console.info(
        `[MetaLead:dev] fbqが未読み込みのため送信スキップ（本番では送信されます） source=${source} eventID=${eventId} pixels=${META_PIXEL_IDS.join(",")}`
      );
    }
    return;
  }

  for (const pixelId of META_PIXEL_IDS) {
    window.fbq("trackSingle", pixelId, "Lead", {}, { eventID: eventId });
  }

  if (isDev) {
    console.info(`[MetaLead:dev] Lead送信 source=${source} eventID=${eventId} pixels=${META_PIXEL_IDS.join(",")}`);
  }
}
