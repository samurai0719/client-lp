// CTAから新築外構診断フォームへ遷移する際に広告計測パラメータを引き継ぐ。
// パラメータの取得ロジックはリフォームLPと共通（components/gaikou/utm.ts）。
import { getUtmQueryString } from "@/components/gaikou/utm";

export { getUtmQueryString, getUtmRecord, UTM_KEYS } from "@/components/gaikou/utm";

export function buildDiagnosisHref(): string {
  return `/new-exterior/diagnosis${getUtmQueryString()}`;
}
