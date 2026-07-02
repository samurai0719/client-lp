// 外構価格設定の検証スクリプト
// 実行: npx tsx scripts/verify-exterior-pricing.ts

import {
  calculateExteriorEstimate,
  calculateSimulatorEstimate,
} from "../lib/calculate-exterior-estimate";
import { lpPriceTable, simulatorWorkTypeEstimates } from "../config/exterior-pricing";

let failed = 0;

function check(name: string, cond: boolean, detail = "") {
  const mark = cond ? "PASS" : "FAIL";
  if (!cond) failed++;
  console.log(`[${mark}] ${name}${detail ? ` — ${detail}` : ""}`);
}

const MAN = 10_000;

// 1. 土間コンクリート10㎡が12万円未満にならない
{
  const r = calculateExteriorEstimate([{ type: "doma-concrete", areaSqm: 10 }]);
  check("1. 土間コンクリート10㎡ ≥ 12万円", r.min >= 12 * MAN, r.label);
}

// 2. 駐車場1台分が22万円未満にならない
{
  const r = calculateExteriorEstimate([{ type: "parking-concrete", cars: 1 }]);
  check("2. 駐車場1台分 ≥ 22万円", r.min >= 22 * MAN, r.label);
  // 面積入力（台数より優先）でも下回らない
  const r2 = calculateExteriorEstimate([{ type: "parking-concrete", areaSqm: 10 }]);
  check("2b. 駐車場 面積10㎡入力でも ≥ 22万円", r2.min >= 22 * MAN, r2.label);
}

// 3. 駐車場2台分が38万円未満にならない
{
  const r = calculateExteriorEstimate([{ type: "parking-concrete", cars: 2 }]);
  check("3. 駐車場2台分 ≥ 38万円", r.min >= 38 * MAN, r.label);
  const r2 = calculateExteriorEstimate([{ type: "parking-concrete", areaSqm: 30 }]);
  check("3b. 駐車場 面積30㎡ ≥ 38万円", r2.min >= 38 * MAN, r2.label);
}

// 4. 2台用カーポートが40万円未満にならない
{
  const r = calculateExteriorEstimate([{ type: "carport", cars: 2 }]);
  check("4. 2台用カーポート ≥ 40万円", r.min >= 40 * MAN, r.label);
}

// 5・6. 駐車場2台＋2台用カーポート＝約80万円〜100万円（80万円未満にならない）
const setWorks = [
  { type: "parking-concrete", cars: 2 },
  { type: "carport", cars: 2 },
] as const;
{
  const r = calculateExteriorEstimate([...setWorks]);
  check("5. セットが80万円未満にならない", r.min >= 80 * MAN, r.label);
  check(
    "6. 標準条件で「約80万円〜100万円」",
    r.label === "約80万円〜100万円",
    r.label
  );
}

// 7. 撤去工事を追加すると価格が上がる
{
  const base = calculateExteriorEstimate([...setWorks]);
  const withRemoval = calculateExteriorEstimate([...setWorks], {
    concreteRemovalSqm: 30,
    blockRemovalM: 5,
  });
  check(
    "7. 撤去工事の追加で価格が上がる",
    withRemoval.min > base.min && withRemoval.max > base.max,
    `${base.label} → ${withRemoval.label}`
  );
}

// 8. 高低差や排水工事を追加すると価格が上がる
{
  const base = calculateExteriorEstimate([...setWorks]);
  const withExtra = calculateExteriorEstimate([...setWorks], {
    drainageWork: true,
    elevationDiff: true,
  });
  check(
    "8. 高低差・排水工事の追加で価格が上がる",
    withExtra.min > base.min && withExtra.max > base.max,
    `${base.label} → ${withExtra.label}`
  );
  // 率ベースの追加費用も確認
  const withRate = calculateExteriorEstimate([...setWorks], {
    difficultAccess: true,
    narrowSite: true,
  });
  check("8b. 重機搬入困難・狭小地でも価格が上がる", withRate.min > base.min, withRate.label);
}

// 9. 複数工事で共通費用が重複しない（単純合算より安くなる）
{
  const a = calculateExteriorEstimate([{ type: "doma-concrete", areaSqm: 20 }]);
  const b = calculateExteriorEstimate([{ type: "fence", lengthM: 10 }]);
  const c = calculateExteriorEstimate([{ type: "artificial-grass", areaSqm: 30 }]);
  const together = calculateExteriorEstimate([
    { type: "doma-concrete", areaSqm: 20 },
    { type: "fence", lengthM: 10 },
    { type: "artificial-grass", areaSqm: 30 },
  ]);
  const plainSum = a.max + b.max + c.max;
  check(
    "9. 3工事同時は単純合算より安い（共通費用の調整）",
    together.max < plainSum,
    `合算${Math.round(plainSum / MAN)}万円 → ${together.label}`
  );
}

// 10. LP料金表とシミュレーション価格が矛盾しない
// （シミュレーターの最低価格がLP料金表の最低価格を下回らない）
{
  const lpMinByLabel: Array<[simId: string, lpLabel: string]> = [
    ["concrete", "土間コンクリート 10㎡"],
    ["carport", "カーポート 1台用"],
    ["fence", "目隠しフェンス"],
    ["artificial-grass", "人工芝"],
  ];
  for (const [simId, lpLabel] of lpMinByLabel) {
    const lpRow = lpPriceTable.find((r) => r.label === lpLabel);
    const lpMin = lpRow ? parseInt(lpRow.price, 10) * MAN : NaN;
    const sim = calculateSimulatorEstimate([simId]);
    check(
      `10. シミュレーター「${simulatorWorkTypeEstimates[simId].label}」 ≥ LP表「${lpLabel}」(${lpRow?.price})`,
      Boolean(sim) && sim!.minMan * MAN >= lpMin,
      sim?.label ?? "null"
    );
  }
  // 「その他」のみは概算対象外
  const otherOnly = calculateSimulatorEstimate(["other"]);
  check("10b. 「その他」のみは概算を出さない", otherOnly === null);
  // 全選択でもエラーにならない
  const all = calculateSimulatorEstimate(Object.keys(simulatorWorkTypeEstimates));
  check("10c. 全工事選択でも計算できる", Boolean(all && all.minMan > 0), all?.label ?? "null");
}

console.log("");
if (failed > 0) {
  console.error(`${failed} 件のテストが失敗しました`);
  process.exit(1);
}
console.log("すべてのテストに合格しました");
