/**
 * 成功報酬の料率。50代以上の求職者は割引で想定年収の5％、それ以外（40代以下・年代不明）は10％。
 * 匿名プロフィールの表示と、管理画面の成功報酬の自動計算で同じ判定を使う。
 */
export const FEE_RATE = 0.1;
export const SENIOR_FEE_RATE = 0.05;

/** 年代（「50代前半」「60代以上」「70代以上」など）が50代以上か */
export function isSeniorDiscount(ageBand: string | null | undefined): boolean {
  const m = ageBand?.match(/^(\d+)代/);
  return m ? Number(m[1]) >= 50 : false;
}

export function feeRateForAgeBand(ageBand: string | null | undefined): number {
  return isSeniorDiscount(ageBand) ? SENIOR_FEE_RATE : FEE_RATE;
}

/** 匿名プロフィールに出す成功報酬の表記 */
export function feeLabelForAgeBand(ageBand: string | null | undefined): string {
  return isSeniorDiscount(ageBand) ? "想定年収の5％（50代以上 割引対象）" : "想定年収の10％";
}
