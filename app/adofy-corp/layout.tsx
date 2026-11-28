import type { Metadata } from "next";
import "./adofy-corp.css";

import AdofyMetaPixel from "@/components/analytics/AdofyMetaPixel";
import LpInsightTracker, { ADOFY_CORP_PROJECT_ID } from "@/components/analytics/LpInsightTracker";
import SiteHeader from "@/components/adofy-corp/chrome/SiteHeader";

export const metadata: Metadata = {
  title: {
    default: "adofy｜岐阜のWebマーケティング・ホームページ制作",
    template: "%s｜adofy",
  },
  description:
    "adofyは岐阜を拠点に、広告運用とホームページ制作で成果につながるWebマーケティングを行っています。",
  // 検索結果・ブラウザのアイコンを adofy のロゴにする（全ページ共通）。
  // /favicon.ico も next.config.ts の rewrite で adofy のアイコンを返す。
  icons: {
    icon: [
      { url: "/images/adofy-corp/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/images/adofy-corp/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/images/adofy-corp/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/images/adofy-corp/apple-touch-icon.png", sizes: "180x180" },
  },
};

export default function AdofyCorpLayout({ children }: { children: React.ReactNode }) {
  // 地色とトークンをこのスコープ内だけに効かせる（他LPに影響させない）
  return (
    <div className="adofy-corp flex min-h-screen flex-col">
      {/* コーポレートサイト配下は全ページ共通で1回だけ読み込む（重複設置しない） */}
      <AdofyMetaPixel />
      <LpInsightTracker projectId={ADOFY_CORP_PROJECT_ID} />
      <SiteHeader />
      {children}
    </div>
  );
}
