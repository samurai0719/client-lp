// ─────────────────────────────────────────────────────────────────────────────
// 外構・エクステリアの価格設定（唯一の価格ソース）
//
// ・高長建設ヒアリングに基づく「標準的な施工条件での概算価格」（税込・円単位）
// ・LP料金表 / AIシミュレーターの概算表示は必ずこのファイルを参照する
//   （コンポーネント内に価格をベタ書きしない）
// ・確定価格ではないため、画面表示時は必ず「概算価格・参考価格」であることと
//   「正式な金額は現地調査後に確定」する旨を併記すること
// ─────────────────────────────────────────────────────────────────────────────

export type PriceRange = { min: number; max: number }; // 単位: 円（税込）

export type CarCount = 1 | 2 | 3;

// ── 1. 土間コンクリート ─────────────────────────────────────────────
export const domaConcrete = {
  /** 標準10㎡の概算 */
  per10Sqm: { min: 120_000, max: 180_000 } as PriceRange,
  /** 面積入力がある場合の㎡単価 */
  perSqm: { min: 10_000, max: 15_000 } as PriceRange,
  /** 最低施工価格 */
  minimumPrice: 120_000,
};

// ── 2. 駐車場コンクリート ───────────────────────────────────────────
export const parkingConcrete = {
  byCars: {
    1: { min: 220_000, max: 300_000 },
    2: { min: 380_000, max: 500_000 },
    3: { min: 550_000, max: 700_000 },
  } as Record<CarCount, PriceRange>,
  /** 台数→想定面積の換算（1台分 約15㎡） */
  assumedSqmPerCar: 15,
  minimumPrice: 220_000,
};

// ── 3. カーポート ───────────────────────────────────────────────────
export const carport = {
  byCars: {
    1: { min: 220_000, max: 320_000 },
    2: { min: 400_000, max: 550_000 },
    3: { min: 600_000, max: 850_000 },
  } as Record<CarCount, PriceRange>,
  gradeMultiplier: {
    standard: 1.0, // 標準
    high: 1.2, // ハイグレード
    design: 1.4, // デザイン重視
  },
};

export type CarportGrade = keyof typeof carport.gradeMultiplier;

// ── 4. 駐車場2台＋2台用カーポートのセット（標準条件） ─────────────────
// 単純合算（38〜50万＋40〜55万＝78〜105万）から、共通する掘削・残土処分・
// 現場管理費を調整した標準セット価格。最低価格は80万円を下回らない。
export const parkingCarportSet: PriceRange = { min: 800_000, max: 1_000_000 };

// ── 5. 目隠しフェンス ───────────────────────────────────────────────
export const fence = {
  perMeter: { min: 15_000, max: 30_000 } as PriceRange,
  minimumPrice: 150_000,
  heightMultiplier: {
    low: 0.9, // 低め
    standard: 1.0, // 標準
    high: 1.2, // 高め
  },
};

export type FenceHeight = keyof typeof fence.heightMultiplier;

// ── 6. 人工芝 ───────────────────────────────────────────────────────
export const artificialGrass = {
  perSqm: { min: 6_000, max: 10_000 } as PriceRange,
  minimumPrice: 150_000,
};

// ── 7. 防草シート＋砂利敷き ─────────────────────────────────────────
export const weedSheetGravel = {
  perSqm: { min: 4_000, max: 7_000 } as PriceRange,
  minimumPrice: 100_000,
};

// ── 8. 庭木・庭石撤去 ───────────────────────────────────────────────
export const gardenClearance = {
  few: { min: 70_000, max: 120_000 } as PriceRange, // 少ない
  normal: { min: 120_000, max: 180_000 } as PriceRange, // 普通
  many: { min: 180_000, max: 250_000 } as PriceRange, // 多い
};

export type GardenClearanceVolume = keyof typeof gardenClearance;

// ── 9. 庭撤去＋駐車場拡張 ───────────────────────────────────────────
export const gardenToParking: PriceRange = { min: 400_000, max: 650_000 };

// ── 10. アプローチ施工 ──────────────────────────────────────────────
export const approach = {
  base: { min: 120_000, max: 300_000 } as PriceRange,
  materialMultiplier: {
    concrete: 1.0, // コンクリート
    flagstone: 1.1, // 平板
    exposedAggregate: 1.15, // 洗い出し
    tile: 1.25, // タイル
    naturalStone: 1.4, // 天然石
  },
};

export type ApproachMaterial = keyof typeof approach.materialMultiplier;

// ── 11. 門柱・機能門柱 ──────────────────────────────────────────────
export const gatePillar: PriceRange = { min: 120_000, max: 280_000 };

// ── 12. ウッドデッキ ────────────────────────────────────────────────
export const woodDeck: PriceRange = { min: 200_000, max: 500_000 };

// ── 13. テラス・屋根 ────────────────────────────────────────────────
export const terraceRoof: PriceRange = { min: 180_000, max: 400_000 };

// ── 14. スロープ・手すり ────────────────────────────────────────────
export const slopeHandrail: PriceRange = { min: 150_000, max: 400_000 };

// ── 15. ブロック・境界工事 ──────────────────────────────────────────
export const blockBoundary = {
  perMeter: { min: 10_000, max: 25_000 } as PriceRange,
};

// ── 追加費用 ────────────────────────────────────────────────────────
export const additionalCosts = {
  /** 既存コンクリート撤去（㎡単価） */
  concreteRemovalPerSqm: { min: 4_000, max: 8_000 } as PriceRange,
  /** 既存ブロック撤去（m単価） */
  blockRemovalPerMeter: { min: 4_000, max: 10_000 } as PriceRange,
  /** 残土処分が多い場合 */
  extraSoilDisposal: { min: 30_000, max: 100_000 } as PriceRange,
  /** 重機が入りにくい場合（総額に対する加算率） */
  difficultAccessRate: { min: 0.05, max: 0.15 },
  /** 勾配・排水工事が必要な場合 */
  drainageWork: { min: 30_000, max: 150_000 } as PriceRange,
  /** 狭小地（総額に対する加算率） */
  narrowSiteRate: { min: 0.05, max: 0.1 },
  /** 高低差あり */
  elevationDiff: { min: 50_000, max: 200_000 } as PriceRange,
};

// ── セット施工の調整 ────────────────────────────────────────────────
// 複数工事を同時に施工する場合、現場管理費・掘削費・残土処分・重機回送・
// 下地工事など共通する施工費の重複分を合計から調整する。
// （商品代そのものの値引きではない）
export function setAdjustmentRate(workCount: number): number {
  if (workCount >= 4) return 0.1;
  if (workCount === 3) return 0.07;
  if (workCount === 2) return 0.05;
  return 0;
}

// ─────────────────────────────────────────────────────────────────────
// LP料金表（/gaikou PriceSection 用の表示データ）
// ─────────────────────────────────────────────────────────────────────

export type LpPriceRow = {
  label: string;
  price: string;
  note?: string;
};

export const lpPriceTable: LpPriceRow[] = [
  {
    label: "土間コンクリート 10㎡",
    price: "12万円〜",
    note: "駐車場やアプローチの土間コンクリート施工に対応します。",
  },
  { label: "駐車場コンクリート 1台分", price: "22万円〜" },
  { label: "駐車場コンクリート 2台分", price: "38万円〜" },
  { label: "カーポート 1台用", price: "22万円〜" },
  { label: "カーポート 2台用", price: "40万円〜" },
  { label: "目隠しフェンス", price: "15万円〜" },
  { label: "人工芝", price: "15万円〜" },
  { label: "防草シート＋砂利", price: "10万円〜" },
];

export const lpSetNote =
  "駐車場2台分のコンクリートと2台用カーポートを同時に施工する場合は、80万円前後からが目安です。";

export const lpPriceDisclaimer =
  "※表示価格は標準的な施工条件での概算です。施工面積、既存外構の撤去、地盤状況、残土処分、排水工事、使用商品によって価格は変動します。正式な金額は現地調査後にお見積もりします。";

export const lpPriceTaxNote = "※価格はいずれも税込の概算です。";

// ─────────────────────────────────────────────────────────────────────
// 新築外構LP料金表（/new-exterior PriceSection 用の表示データ）
// 新築の更地は既存外構の撤去・処分が不要なため、リフォームLPの料金表とは
// 別の参考価格を掲載する。掲載価格を変更するときはここだけを修正する。
// ─────────────────────────────────────────────────────────────────────

export const newExteriorLpPriceTable: LpPriceRow[] = [
  { label: "駐車場コンクリート 1台分", price: "15万円〜" },
  { label: "駐車場コンクリート 2台分", price: "30万円〜" },
  { label: "カーポート 1台用", price: "25万円〜" },
  { label: "カーポート 2台用", price: "45万円〜" },
  { label: "門柱・ポスト", price: "15万円〜" },
  { label: "フェンス工事", price: "20万円〜" },
  { label: "人工芝・庭工事", price: "15万円〜" },
  {
    label: "新築外構一式",
    price: "100万円〜",
    note: "駐車場・門柱・アプローチ・フェンスなどをまとめて施工するプランの目安です。",
  },
];

export const newExteriorPriceDisclaimer =
  "※敷地条件・面積・使用する材料により金額は変動します。正確な金額は現地調査後にご提示します。";

// ─────────────────────────────────────────────────────────────────────
// 新築外構シミュレーター用：工事内容ごとの既定概算レンジ
// 新築の更地は撤去・処分費がかからないため、リフォーム用より低めのレンジ。
// 最低価格は newExteriorLpPriceTable の最低価格を下回らないこと。
// ─────────────────────────────────────────────────────────────────────

export const newExteriorSimulatorEstimates: Record<
  string,
  { label: string; range: PriceRange | null }
> = {
  // 駐車場コンクリート（台数未選択のため1〜2台分の幅）
  "parking-concrete": { label: "駐車場コンクリート", range: { min: 150_000, max: 450_000 } },
  // カーポート（台数未選択のため1〜2台用の幅）
  carport: { label: "カーポート", range: { min: 250_000, max: 600_000 } },
  "gate-mailbox": { label: "門柱・ポスト", range: { min: 150_000, max: 300_000 } },
  entrance: { label: "アプローチ", range: { min: 100_000, max: 300_000 } },
  fence: { label: "フェンス・目隠し", range: { min: 200_000, max: 400_000 } },
  "artificial-grass": { label: "人工芝・庭づくり", range: { min: 150_000, max: 350_000 } },
  planting: { label: "植栽", range: { min: 50_000, max: 200_000 } },
  // 外構一式（現地条件の影響が大きいため広めのレンジ）
  "full-exterior": { label: "新築外構一式", range: { min: 1_000_000, max: 2_000_000 } },
};

// 台数が選択された場合の駐車場・カーポートの新築向け概算
export const newExteriorParkingByCars: Record<CarCount, PriceRange> = {
  1: { min: 150_000, max: 250_000 },
  2: { min: 300_000, max: 450_000 },
  3: { min: 450_000, max: 650_000 },
};

export const newExteriorCarportByCars: Record<CarCount, PriceRange> = {
  1: { min: 250_000, max: 350_000 },
  2: { min: 450_000, max: 600_000 },
  3: { min: 650_000, max: 900_000 },
};

// ─────────────────────────────────────────────────────────────────────
// 診断フォーム（/gaikou/diagnosis）の概算表示調整
// 概算目安（最安のみ表示）をレンジ算出値から一律で差し引く額。
// 2026-07-14 オーナー指示：約20万円安く表示する。
// 表示が極端に安くなりすぎないよう、下限は diagnosisEstimateFloor を下回らない。
// ─────────────────────────────────────────────────────────────────────
export const diagnosisEstimateDiscount = 200_000;
export const diagnosisEstimateFloor = 100_000;

// ─────────────────────────────────────────────────────────────────────
// AIシミュレーター概算のベース上乗せ額
// 現場ごとの諸経費・付帯工事のための余裕分として、算出した概算レンジ全体へ
// 一律で上乗せする（「概算価格の範囲内で施工」の約束を守るための安全余裕）。
// ─────────────────────────────────────────────────────────────────────
export const simulatorBaseUplift = 150_000;

// ─────────────────────────────────────────────────────────────────────
// AIシミュレーター用：工事内容ごとの既定概算レンジ
// 面積・グレード等の入力がない標準条件のため、幅を広めに設定している。
// 台数が選択された場合は parkingConcrete / carport の台数別価格を優先する。
// 最低価格はLP料金表の最低価格を下回らないこと。
// ─────────────────────────────────────────────────────────────────────

export type SimulatorEstimateDef = {
  label: string;
  /** null は概算対象外（現地調査でご案内） */
  range: PriceRange | null;
};

export const simulatorWorkTypeEstimates: Record<string, SimulatorEstimateDef> = {
  // 土間コンクリート（面積未入力のため10〜20㎡想定で幅広め）
  concrete: { label: "土間コンクリート", range: { min: 120_000, max: 300_000 } },
  // 駐車場の拡張（庭撤去＋駐車場拡張を適用）
  "parking-expansion": { label: "駐車場の拡張", range: gardenToParking },
  // 人工芝・防草対策
  "artificial-grass": { label: "人工芝・防草対策", range: { min: 150_000, max: 300_000 } },
  // カーポート（台数未入力のため1〜2台用の幅）
  carport: { label: "カーポート", range: { min: carport.byCars[1].min, max: carport.byCars[2].max } },
  // 目隠しフェンス（長さ未入力のため5〜10m想定）
  fence: { label: "目隠しフェンス", range: { min: fence.minimumPrice, max: 300_000 } },
  // 庭木・庭石の撤去（量が不明のため「少ない〜多い」の全幅）
  "garden-clearance": {
    label: "庭木・庭石の撤去",
    range: { min: gardenClearance.few.min, max: gardenClearance.many.max },
  },
  // 玄関アプローチ
  entrance: { label: "玄関アプローチ", range: approach.base },
  // スロープ・手すり
  "slope-handrail": { label: "スロープ・手すり", range: slopeHandrail },
  // 門柱・宅配ボックス
  "gate-mailbox": { label: "門柱・宅配ボックス", range: gatePillar },
  // その他は内容が特定できないため概算対象外
  other: { label: "その他", range: null },
};
