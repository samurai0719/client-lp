// 外構プラン無料診断（/gaikou/diagnosis）STEP4 の概算価格算出。
//
// 価格の実数値は config/exterior-pricing.ts のレンジのみを使用し、
// このファイルで新しい金額を定義しない（根拠のない金額を作らないため）。
// 診断の選択肢IDを、既存のシミュレーター概算ID（リフォーム／新築外構）へ
// 変換して calculateSimulatorEstimate 系に委譲する。

import {
  calculateNewExteriorSimulatorEstimate,
  calculateSimulatorEstimate,
  type SimulatorEstimate,
} from "./calculate-exterior-estimate";
import type { CarCount } from "../config/exterior-pricing";

// 診断の工事内容ID → リフォームシミュレーターの概算ID
const REFORM_ESTIMATE_ID: Record<string, string | null> = {
  concrete: "concrete",
  "expand-parking": "parking-expansion",
  "garden-to-parking": "parking-expansion",
  carport: "carport",
  "weed-control": "artificial-grass",
  "privacy-fence": "fence",
  "remove-trees-rocks": "garden-clearance",
  "turf-tile-deck": "artificial-grass",
  // 一式・未定は内容が特定できないため概算対象外（現地調査でご案内）
  "full-renovation": null,
  undecided: null,
};

// 診断の工事内容ID（新築外構用 nc- 接頭辞）→ 新築外構シミュレーターの概算ID
const NEW_CONSTRUCTION_ESTIMATE_ID: Record<string, string | null> = {
  "nc-parking-concrete": "parking-concrete",
  "nc-carport": "carport",
  "nc-gate-post": "gate-mailbox",
  "nc-approach": "entrance",
  "nc-fence": "fence",
  "nc-garden": "artificial-grass",
  "nc-full-set": "full-exterior",
  // 内容未定は概算対象外（現地調査でご案内）
  "nc-undecided": null,
};

// 診断の広さID → 駐車場台数（概算精度を上げるためのヒント）
const SIZE_TO_CARS: Record<string, CarCount> = {
  "parking-1": 1,
  "parking-2": 2,
  "parking-3plus": 3,
};

export type DiagnosisEstimateInput = {
  workType: string | null;
  constructionTypes: string[];
  size: string | null;
};

/**
 * 診断の回答から概算価格レンジを算出する。
 * 概算対象の工事が1つもない場合は null（現地調査でご案内する旨を表示する）。
 */
export function calculateDiagnosisEstimate(input: DiagnosisEstimateInput): SimulatorEstimate | null {
  const isNewConstruction = input.workType === "new-construction";
  const idMap = isNewConstruction ? NEW_CONSTRUCTION_ESTIMATE_ID : REFORM_ESTIMATE_ID;

  const hasUnmapped = input.constructionTypes.some((id) => !idMap[id]);
  const estimateIds = input.constructionTypes
    .map((id) => idMap[id])
    .filter((id): id is string => Boolean(id));

  const parkingCars = input.size ? SIZE_TO_CARS[input.size] ?? null : null;

  const estimate = isNewConstruction
    ? calculateNewExteriorSimulatorEstimate(estimateIds, { parkingCars })
    : calculateSimulatorEstimate(estimateIds, { parkingCars });

  if (!estimate) return null;
  // 概算に含められなかった工事（一式・未定など）があれば注記フラグを立てる
  return { ...estimate, hasUnpriced: estimate.hasUnpriced || hasUnmapped };
}
