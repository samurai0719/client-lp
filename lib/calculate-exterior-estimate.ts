// ─────────────────────────────────────────────────────────────────────────────
// 外構工事の概算価格計算
//
// 価格の実数値は config/exterior-pricing.ts のみを参照する。
// 返す金額はすべて「税込の概算価格」であり、確定価格ではない。
// Nodeスクリプト（scripts/verify-exterior-pricing.ts）から直接実行できるよう、
// このファイルと config は相対importで繋ぐ。
// ─────────────────────────────────────────────────────────────────────────────

import {
  additionalCosts,
  approach,
  artificialGrass,
  blockBoundary,
  carport,
  domaConcrete,
  fence,
  gardenClearance,
  gardenToParking,
  gatePillar,
  newExteriorCarportByCars,
  newExteriorParkingByCars,
  newExteriorSimulatorEstimates,
  parkingCarportSet,
  parkingConcrete,
  setAdjustmentRate,
  simulatorBaseUplift,
  simulatorWorkTypeEstimates,
  slopeHandrail,
  terraceRoof,
  weedSheetGravel,
  woodDeck,
  type ApproachMaterial,
  type CarCount,
  type CarportGrade,
  type FenceHeight,
  type GardenClearanceVolume,
  type PriceRange,
} from "../config/exterior-pricing";

// ── 入力型 ──────────────────────────────────────────────────────────

export type WorkInput =
  | { type: "doma-concrete"; areaSqm?: number }
  | { type: "parking-concrete"; cars?: CarCount; areaSqm?: number }
  | { type: "carport"; cars?: CarCount; grade?: CarportGrade }
  | { type: "fence"; lengthM?: number; height?: FenceHeight }
  | { type: "artificial-grass"; areaSqm?: number }
  | { type: "weed-sheet-gravel"; areaSqm?: number }
  | { type: "garden-clearance"; volume?: GardenClearanceVolume }
  | { type: "garden-to-parking" }
  | { type: "approach"; material?: ApproachMaterial }
  | { type: "gate-pillar" }
  | { type: "wood-deck" }
  | { type: "terrace-roof" }
  | { type: "slope-handrail" }
  | { type: "block-boundary"; lengthM?: number };

export type AdditionalCostInput = {
  /** 既存コンクリート撤去の面積（㎡） */
  concreteRemovalSqm?: number;
  /** 既存ブロック撤去の長さ（m） */
  blockRemovalM?: number;
  /** 残土処分が多い */
  extraSoilDisposal?: boolean;
  /** 重機が入りにくい */
  difficultAccess?: boolean;
  /** 勾配・排水工事が必要 */
  drainageWork?: boolean;
  /** 狭小地 */
  narrowSite?: boolean;
  /** 高低差あり */
  elevationDiff?: boolean;
};

export type EstimateResult = {
  /** 円単位（丸め前） */
  min: number;
  max: number;
  /** 万円単位（1万円単位に丸め済み） */
  minMan: number;
  maxMan: number;
  /** 例: 「約80万円〜100万円」 */
  label: string;
};

// ── レンジ演算ヘルパー ──────────────────────────────────────────────

const YEN_PER_MAN = 10_000;

function add(a: PriceRange, b: PriceRange): PriceRange {
  return { min: a.min + b.min, max: a.max + b.max };
}

function scale(r: PriceRange, factor: number): PriceRange {
  return { min: r.min * factor, max: r.max * factor };
}

/** 最低施工価格を適用する（下限を引き上げ、上限が下限を下回らないようにする） */
function applyMinimum(r: PriceRange, minimumPrice: number): PriceRange {
  const min = Math.max(r.min, minimumPrice);
  return { min, max: Math.max(r.max, min) };
}

function toResult(r: PriceRange): EstimateResult {
  const minMan = Math.round(r.min / YEN_PER_MAN);
  const maxMan = Math.round(r.max / YEN_PER_MAN);
  const label =
    minMan === maxMan ? `約${minMan}万円` : `約${minMan}万円〜${maxMan}万円`;
  return { min: r.min, max: r.max, minMan, maxMan, label };
}

// ── 工事ごとの概算レンジ ────────────────────────────────────────────

/** 駐車場コンクリート：台数のアンカー（15/30/45㎡）を面積で線形補間する */
function parkingConcreteByArea(areaSqm: number): PriceRange {
  const per = parkingConcrete.assumedSqmPerCar;
  const anchors: Array<[number, PriceRange]> = [
    [per * 1, parkingConcrete.byCars[1]],
    [per * 2, parkingConcrete.byCars[2]],
    [per * 3, parkingConcrete.byCars[3]],
  ];

  // 1台分未満の面積は1台分として扱う（最低施工価格の考え方）
  const area = Math.max(anchors[0][0], areaSqm);

  for (let i = 0; i < anchors.length - 1; i++) {
    const [a1, r1] = anchors[i];
    const [a2, r2] = anchors[i + 1];
    if (area <= a2) {
      const t = (area - a1) / (a2 - a1);
      return {
        min: r1.min + (r2.min - r1.min) * t,
        max: r1.max + (r2.max - r1.max) * t,
      };
    }
  }

  // 3台分超は最終区間の㎡単価で外挿
  const [a2, r2] = anchors[1];
  const [a3, r3] = anchors[2];
  const slopeMin = (r3.min - r2.min) / (a3 - a2);
  const slopeMax = (r3.max - r2.max) / (a3 - a2);
  return {
    min: r3.min + slopeMin * (area - a3),
    max: r3.max + slopeMax * (area - a3),
  };
}

export function calculateWorkRange(work: WorkInput): PriceRange {
  switch (work.type) {
    case "doma-concrete": {
      if (work.areaSqm && work.areaSqm > 0) {
        return applyMinimum(scale(domaConcrete.perSqm, work.areaSqm), domaConcrete.minimumPrice);
      }
      return applyMinimum(domaConcrete.per10Sqm, domaConcrete.minimumPrice);
    }
    case "parking-concrete": {
      // 面積入力がある場合は台数より面積を優先する
      if (work.areaSqm && work.areaSqm > 0) {
        return applyMinimum(parkingConcreteByArea(work.areaSqm), parkingConcrete.minimumPrice);
      }
      return parkingConcrete.byCars[work.cars ?? 1];
    }
    case "carport": {
      const base = work.cars
        ? carport.byCars[work.cars]
        : // 台数が不明な場合は1〜2台用の幅で広めに見る
          { min: carport.byCars[1].min, max: carport.byCars[2].max };
      return scale(base, carport.gradeMultiplier[work.grade ?? "standard"]);
    }
    case "fence": {
      const mult = fence.heightMultiplier[work.height ?? "standard"];
      if (work.lengthM && work.lengthM > 0) {
        return applyMinimum(scale(fence.perMeter, work.lengthM * mult), fence.minimumPrice);
      }
      // 長さが不明な場合は5〜10m想定で広めに見る
      return applyMinimum(scale({ min: fence.perMeter.min * 5, max: fence.perMeter.max * 10 }, mult), fence.minimumPrice);
    }
    case "artificial-grass": {
      if (work.areaSqm && work.areaSqm > 0) {
        return applyMinimum(scale(artificialGrass.perSqm, work.areaSqm), artificialGrass.minimumPrice);
      }
      return applyMinimum({ min: artificialGrass.perSqm.min * 25, max: artificialGrass.perSqm.max * 30 }, artificialGrass.minimumPrice);
    }
    case "weed-sheet-gravel": {
      if (work.areaSqm && work.areaSqm > 0) {
        return applyMinimum(scale(weedSheetGravel.perSqm, work.areaSqm), weedSheetGravel.minimumPrice);
      }
      return applyMinimum({ min: weedSheetGravel.perSqm.min * 25, max: weedSheetGravel.perSqm.max * 30 }, weedSheetGravel.minimumPrice);
    }
    case "garden-clearance": {
      if (work.volume) return gardenClearance[work.volume];
      // 量が不明な場合は「少ない〜多い」の全幅
      return { min: gardenClearance.few.min, max: gardenClearance.many.max };
    }
    case "garden-to-parking":
      return gardenToParking;
    case "approach":
      return scale(approach.base, approach.materialMultiplier[work.material ?? "concrete"]);
    case "gate-pillar":
      return gatePillar;
    case "wood-deck":
      return woodDeck;
    case "terrace-roof":
      return terraceRoof;
    case "slope-handrail":
      return slopeHandrail;
    case "block-boundary": {
      const lengthM = work.lengthM && work.lengthM > 0 ? work.lengthM : 10;
      return scale(blockBoundary.perMeter, lengthM);
    }
  }
}

// ── セット判定 ──────────────────────────────────────────────────────

/** 「駐車場コンクリート2台分＋2台用カーポート（標準）」の組み合わせか */
function isParkingCarportSetPair(a: WorkInput, b: WorkInput): boolean {
  const isParking2 = (w: WorkInput) =>
    w.type === "parking-concrete" && w.cars === 2 && !w.areaSqm;
  const isCarport2 = (w: WorkInput) =>
    w.type === "carport" && w.cars === 2 && (w.grade ?? "standard") === "standard";
  return (isParking2(a) && isCarport2(b)) || (isParking2(b) && isCarport2(a));
}

// ── メイン計算 ──────────────────────────────────────────────────────

export function calculateExteriorEstimate(
  works: WorkInput[],
  additional: AdditionalCostInput = {}
): EstimateResult {
  let subtotal: PriceRange = { min: 0, max: 0 };

  // 駐車場2台＋2台用カーポート（標準）はセット価格（共通施工費調整済み）を適用
  let remaining = [...works];
  let hasSetPair = false;
  for (let i = 0; i < remaining.length && !hasSetPair; i++) {
    for (let j = i + 1; j < remaining.length; j++) {
      if (isParkingCarportSetPair(remaining[i], remaining[j])) {
        hasSetPair = true;
        remaining = remaining.filter((_, idx) => idx !== i && idx !== j);
        subtotal = add(subtotal, parkingCarportSet);
        break;
      }
    }
  }

  // 残りの工事は単純合算のうえ、工事数に応じて共通施工費
  // （現場管理費・掘削費・残土処分・重機回送・下地工事）の重複分を調整する
  if (remaining.length > 0) {
    let rest: PriceRange = { min: 0, max: 0 };
    for (const work of remaining) {
      rest = add(rest, calculateWorkRange(work));
    }
    const rate = setAdjustmentRate(works.length);
    subtotal = add(subtotal, scale(rest, 1 - rate));
  }

  // セット適用時は合計もセット最低価格を下回らない
  if (hasSetPair) {
    subtotal = applyMinimum(subtotal, parkingCarportSet.min);
  }

  // ── 追加費用 ──
  let total = subtotal;
  if (additional.concreteRemovalSqm && additional.concreteRemovalSqm > 0) {
    total = add(total, scale(additionalCosts.concreteRemovalPerSqm, additional.concreteRemovalSqm));
  }
  if (additional.blockRemovalM && additional.blockRemovalM > 0) {
    total = add(total, scale(additionalCosts.blockRemovalPerMeter, additional.blockRemovalM));
  }
  if (additional.extraSoilDisposal) total = add(total, additionalCosts.extraSoilDisposal);
  if (additional.drainageWork) total = add(total, additionalCosts.drainageWork);
  if (additional.elevationDiff) total = add(total, additionalCosts.elevationDiff);
  if (additional.difficultAccess) {
    total = {
      min: total.min + subtotal.min * additionalCosts.difficultAccessRate.min,
      max: total.max + subtotal.max * additionalCosts.difficultAccessRate.max,
    };
  }
  if (additional.narrowSite) {
    total = {
      min: total.min + subtotal.min * additionalCosts.narrowSiteRate.min,
      max: total.max + subtotal.max * additionalCosts.narrowSiteRate.max,
    };
  }

  return toResult(total);
}

// ─────────────────────────────────────────────────────────────────────
// AIシミュレーター用：選択された工事内容IDから概算価格を算出
// （面積・グレード等の入力がないため、標準条件の広めのレンジを合算する）
// ─────────────────────────────────────────────────────────────────────

export const SIMULATOR_ESTIMATE_STORAGE_KEY = "gaikou-simulator-estimate-v1";

export type SimulatorEstimate = {
  /** 例: 「約80万円〜100万円」 */
  label: string;
  minMan: number;
  maxMan: number;
  /** 概算対象になった工事名 */
  works: string[];
  /** 概算対象外（その他）が含まれるか */
  hasUnpriced: boolean;
};

export type SimulatorEstimateOptions = {
  /** 駐車場・カーポートの台数（未選択は null＝幅広の既定レンジ） */
  parkingCars?: CarCount | null;
};

export function calculateSimulatorEstimate(
  workTypeIds: string[],
  options: SimulatorEstimateOptions = {}
): SimulatorEstimate | null {
  const parkingCars = options.parkingCars ?? null;
  const ids = [...new Set(workTypeIds)].filter((id) => simulatorWorkTypeEstimates[id]);
  const hasUnpriced = ids.some((id) => simulatorWorkTypeEstimates[id].range === null);

  // 駐車場2台分＋2台用カーポートはセット価格（共通施工費調整済み）を適用
  const useSet = parkingCars === 2 && ids.includes("concrete") && ids.includes("carport");

  const setLabels: string[] = [];
  const items: Array<{ label: string; range: PriceRange }> = [];

  for (const id of ids) {
    const def = simulatorWorkTypeEstimates[id];
    if (def.range === null) continue;
    // 台数が選択されていれば、コンクリート／カーポートは台数別価格を優先する
    if (id === "concrete" && parkingCars) {
      const label = `駐車場コンクリート（${parkingCars}台分）`;
      if (useSet) {
        setLabels.push(label);
      } else {
        items.push({ label, range: parkingConcrete.byCars[parkingCars] });
      }
      continue;
    }
    if (id === "carport" && parkingCars) {
      const label = `カーポート（${parkingCars}台用）`;
      if (useSet) {
        setLabels.push(label);
      } else {
        items.push({ label, range: carport.byCars[parkingCars] });
      }
      continue;
    }
    items.push({ label: def.label, range: def.range });
  }

  // セットは2工事分として数え、共通施工費の調整率を決める
  const pricedCount = items.length + (useSet ? 2 : 0);
  if (pricedCount === 0) return null;

  let sum: PriceRange = { min: 0, max: 0 };
  if (useSet) sum = add(sum, parkingCarportSet);
  if (items.length > 0) {
    let rest: PriceRange = { min: 0, max: 0 };
    for (const item of items) {
      rest = add(rest, item.range);
    }
    // セット部分は調整済みのため、残りの工事にのみ調整率を適用する
    sum = add(sum, scale(rest, 1 - setAdjustmentRate(pricedCount)));
  }

  // ベース上乗せ額（諸経費・付帯工事の余裕分）を全体へ一律加算
  sum = { min: sum.min + simulatorBaseUplift, max: sum.max + simulatorBaseUplift };

  const result = toResult(sum);
  return {
    label: result.label,
    minMan: result.minMan,
    maxMan: result.maxMan,
    works: [...setLabels, ...items.map((item) => item.label)],
    hasUnpriced,
  };
}

// ─────────────────────────────────────────────────────────────────────
// 新築外構シミュレーター用：選択された工事内容IDから概算価格を算出
// 価格レンジは config/exterior-pricing.ts の newExteriorSimulatorEstimates を参照。
// リフォーム用の calculateSimulatorEstimate と同じ考え方で、
// 工事数に応じた共通施工費の調整とベース上乗せ額を適用する。
// ─────────────────────────────────────────────────────────────────────

export const NEW_EXTERIOR_SIMULATOR_ESTIMATE_STORAGE_KEY = "new-exterior-simulator-estimate-v1";

export function calculateNewExteriorSimulatorEstimate(
  workTypeIds: string[],
  options: SimulatorEstimateOptions = {}
): SimulatorEstimate | null {
  const parkingCars = options.parkingCars ?? null;
  const ids = [...new Set(workTypeIds)].filter((id) => newExteriorSimulatorEstimates[id]);
  const hasUnpriced = ids.some((id) => newExteriorSimulatorEstimates[id].range === null);

  // 「外構一式」が選ばれている場合は個別工事を含む一式レンジを優先する
  if (ids.includes("full-exterior")) {
    const def = newExteriorSimulatorEstimates["full-exterior"];
    if (!def.range) return null;
    const sum = {
      min: def.range.min + simulatorBaseUplift,
      max: def.range.max + simulatorBaseUplift,
    };
    const result = toResult(sum);
    return {
      label: result.label,
      minMan: result.minMan,
      maxMan: result.maxMan,
      works: [def.label],
      hasUnpriced,
    };
  }

  const items: Array<{ label: string; range: PriceRange }> = [];
  for (const id of ids) {
    const def = newExteriorSimulatorEstimates[id];
    if (def.range === null) continue;
    // 台数が選択されていれば、駐車場コンクリート・カーポートは台数別価格を優先する
    if (id === "parking-concrete" && parkingCars) {
      items.push({ label: `駐車場コンクリート（${parkingCars}台分）`, range: newExteriorParkingByCars[parkingCars] });
      continue;
    }
    if (id === "carport" && parkingCars) {
      items.push({ label: `カーポート（${parkingCars}台用）`, range: newExteriorCarportByCars[parkingCars] });
      continue;
    }
    items.push({ label: def.label, range: def.range });
  }

  if (items.length === 0) return null;

  let rest: PriceRange = { min: 0, max: 0 };
  for (const item of items) {
    rest = add(rest, item.range);
  }
  let sum = scale(rest, 1 - setAdjustmentRate(items.length));
  sum = { min: sum.min + simulatorBaseUplift, max: sum.max + simulatorBaseUplift };

  const result = toResult(sum);
  return {
    label: result.label,
    minMan: result.minMan,
    maxMan: result.maxMan,
    works: items.map((item) => item.label),
    hasUnpriced,
  };
}
