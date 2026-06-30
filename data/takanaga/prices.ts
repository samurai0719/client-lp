// ─────────────────────────────────────────────────────────────────────────────
// 費用目安データ
// 価格が確定していない項目は priceLabel を null にしてください。
// ─────────────────────────────────────────────────────────────────────────────

export type PriceItem = {
  id: string;
  workType: string;
  priceLabel: string | null; // null = 「現地調査後にご案内」と表示
  priceNote?: string;
  visible: boolean;
};

export const priceItems: PriceItem[] = [
  {
    id: "doma-concrete",
    workType: "土間コンクリート（10㎡）",
    priceLabel: "18万円〜",
    priceNote: "掘削・下地処理・残土処分などを含む目安です。",
    visible: true,
  },
  {
    id: "parking-1",
    workType: "駐車場コンクリート（1台分）",
    priceLabel: "30万円〜",
    visible: true,
  },
  {
    id: "parking-2",
    workType: "駐車場コンクリート（2台分）",
    priceLabel: "50万円〜",
    visible: true,
  },
  {
    id: "carport",
    workType: "カーポート設置（1台用）",
    priceLabel: "30万円〜",
    visible: true,
  },
  {
    id: "fence",
    workType: "目隠しフェンス設置",
    priceLabel: "20万円〜",
    visible: true,
  },
  {
    id: "grass",
    workType: "人工芝施工",
    priceLabel: "20万円〜",
    visible: true,
  },
  {
    id: "gravel",
    workType: "防草シート＋砂利敷き",
    priceLabel: "12万円〜",
    visible: true,
  },
];

export const visiblePriceItems = priceItems.filter((p) => p.visible);

// 費用に影響する主な要因
export const costFactors: string[] = [
  "現地の広さ・施工面積",
  "既存物（砂利・コンクリート・庭木）の撤去",
  "使用する商品・素材のグレード",
  "地面の状態（軟弱地盤など）",
  "重機が現場に入れるかどうか",
  "排水工事・桝調整の有無",
  "道路と敷地の高低差",
  "現場までの運搬距離",
];
