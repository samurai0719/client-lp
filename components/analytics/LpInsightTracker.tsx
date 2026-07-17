import Script from "next/script";

// 高長建設のヒートマップ計測タグ (LP Insight)。
// 自社運用の LP Insight (Vercel) にクリック/スクロール/アテンション等を送信する。
// このリポジトリは他社LPも同居するため app/layout.tsx には入れず、対象ページにのみ設置する。
// プロジェクトは2つ: 外構広告LP(既定) と コーポレートHP(projectId指定)。
const TRACKER_SRC = "https://lp-insight-rosy.vercel.app/tracker.js";

/** 外構リフォーム広告LP (デフォルト) */
const GAIKOU_LP_PROJECT_ID = "063ecbb7-8412-422d-90dc-dca0a4a24fda";
/** コーポレートHP用 */
export const TAKANAGA_HP_PROJECT_ID = "375fd391-9df4-42d9-be2b-51f7f50f6026";

export default function LpInsightTracker({
  projectId = GAIKOU_LP_PROJECT_ID,
}: {
  projectId?: string;
}) {
  return (
    <Script
      id="lp-insight-tracker"
      src={TRACKER_SRC}
      data-project-id={projectId}
      strategy="afterInteractive"
    />
  );
}
