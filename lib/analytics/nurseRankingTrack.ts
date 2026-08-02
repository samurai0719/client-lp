// /nurse-ranking 専用のクリック計測ヘルパー。
// GA4（window.gtag）が導入されていない環境でも trackEvent 側で安全にno-opになるため、
// ここでエラーハンドリングを重ねる必要はない。個人情報は一切送信しない。

import { trackEvent } from "@/lib/analytics/track";

export type ClickPosition =
  | "hero"
  | "comparison_table"
  | "rank_card"
  | "type_recommendation"
  | "sticky_cta";

export function trackAffiliateClick(params: {
  service: string;
  rank: 1 | 2 | 3;
  position: ClickPosition;
}): void {
  trackEvent("select_affiliate_service", {
    service_name: params.service,
    rank: params.rank,
    position: params.position,
  });
}
