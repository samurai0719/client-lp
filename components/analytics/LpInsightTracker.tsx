import Script from "next/script";

// 高長建設「外構リフォームLP」専用のヒートマップ計測タグ (LP Insight)。
// 自社運用の LP Insight (Vercel) にクリック/スクロール/アテンション等を送信する。
// このリポジトリは他社LPも同居するため app/layout.tsx には入れず、対象ページにのみ設置する。
const TRACKER_SRC = "https://lp-insight-rosy.vercel.app/tracker.js";
const PROJECT_ID = "063ecbb7-8412-422d-90dc-dca0a4a24fda";

export default function LpInsightTracker() {
  return (
    <Script
      id="lp-insight-tracker"
      src={TRACKER_SRC}
      data-project-id={PROJECT_ID}
      strategy="afterInteractive"
    />
  );
}
