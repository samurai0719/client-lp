import type { Metadata } from "next";
import Script from "next/script";
import GaikouLandingPage from "./GaikouLandingPage";
import TakanagaMetaPixel from "@/components/analytics/TakanagaMetaPixel";
import LpInsightTracker from "@/components/analytics/LpInsightTracker";

export const metadata: Metadata = {
  title: "岐阜県の外構リフォーム・駐車場コンクリート工事｜高長建設",
  description:
    "高長建設｜岐阜県で駐車場コンクリート、庭リフォーム、雑草対策、カーポート、フェンス工事に対応。現地調査・見積もり無料。施工会社が直接対応します。",
  alternates: {
    // 2026-07-04切替済み: このLPは takanagakensetu.com/takanaga として配信される
    canonical: "https://www.takanagakensetu.com/takanaga",
  },
  // 広告流入用LPのため、会社名検索でコーポレートHP（/）と競合させない
  robots: { index: false, follow: true },
};

export default function GaikouPage() {
  return (
    <>
      <TakanagaMetaPixel />
      {/* Ptengine（高長建設LP限定） */}
      <Script id="ptengine-tag-gaikou" src="https://js.ptengine.jp/5ea63otf.js" strategy="afterInteractive" />
      {/* LP Insight ヒートマップ（自社運用） */}
      <LpInsightTracker />
      <GaikouLandingPage />
    </>
  );
}
