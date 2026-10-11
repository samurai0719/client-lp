import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "../adofy/adofy.css";
import "./free-design.css";
import AdofyMetaPixel from "@/components/analytics/AdofyMetaPixel";
import LpInsightTracker, { ADOFY_LP_PROJECT_ID } from "@/components/analytics/LpInsightTracker";
import FreeDesignChat from "@/components/adofy/free-design/FreeDesignChat";
import FreeDesignFooter from "@/components/adofy/free-design/FreeDesignFooter";
import { SITE } from "@/components/adofy/config";

const TITLE = "ホームページを無料で作る｜集客・求人できるHP制作 adofy";
const DESC =
  "かんたんな質問に答えるだけで、集客・求人できるあなたの会社専用のホームページを無料で作成します。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/free-design" },
  openGraph: { type: "website", locale: "ja_JP", siteName: SITE.name, title: TITLE, description: DESC },
  // 申し込み画面は検索結果に出す必要がないため、インデックスさせない
  robots: { index: false, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#facc15",
};

export default function FreeDesignPage() {
  return (
    <div className="adf-lp fd-page">
      <AdofyMetaPixel />
      <LpInsightTracker projectId={ADOFY_LP_PROJECT_ID} />
      <header className="fd-header">
        <Link href="/adofy" className="fd-header__logo" aria-label="adofy トップへ">
          <span className="fd-header__mark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/adofy/free-design/robot-face.webp" alt="" width={36} height={36} />
          </span>
          <span className="fd-header__name">adofy</span>
        </Link>
        <span className="fd-header__tag">ホームページ無料作成</span>
      </header>
      <main className="fd-main">
        <FreeDesignChat />
      </main>
      <FreeDesignFooter />
    </div>
  );
}
