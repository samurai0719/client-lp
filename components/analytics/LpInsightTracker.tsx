import Script from "next/script";

// ヒートマップ計測タグ (LP Insight)。
// 自社運用の LP Insight (Vercel) にクリック/スクロール/アテンション等を送信する。
// このリポジトリは他社LPも同居するため app/layout.tsx には入れず、対象ページにのみ設置する。
// プロジェクトは3つ: 高長建設の外構広告LP(既定) / 高長建設コーポレートHP / adofy集客LP。
const TRACKER_SRC = "https://lp-insight-rosy.vercel.app/tracker.js";

/** 外構リフォーム広告LP (デフォルト) */
const GAIKOU_LP_PROJECT_ID = "063ecbb7-8412-422d-90dc-dca0a4a24fda";
/** 高長建設コーポレートHP用 */
export const TAKANAGA_HP_PROJECT_ID = "375fd391-9df4-42d9-be2b-51f7f50f6026";
/** adofy集客LP用 (/adofy, /contact, /contact/thanks) */
export const ADOFY_LP_PROJECT_ID = "5f3419a3-3090-43e5-9107-cfe2c6568d96";

export default function LpInsightTracker({
  projectId = GAIKOU_LP_PROJECT_ID,
}: {
  projectId?: string;
}) {
  // プロジェクト未設定のまま計測タグを出すと不明プロジェクトへの送信になるため、
  // IDが空のときは何も描画しない
  if (!projectId) return null;

  return (
    <Script
      id="lp-insight-tracker"
      src={TRACKER_SRC}
      data-project-id={projectId}
      strategy="afterInteractive"
    />
  );
}
