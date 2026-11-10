import type { Metadata, Viewport } from "next";
import ConsultContent from "@/components/driver-company/consult/ConsultContent";

/**
 * ドラテク 企業向け「無料オンライン相談」LP。
 *
 * 公開URL … https://driver.taxidriver-beginner.com/company と https://doratech.adofy-site.com/consult（同じページ）
 * 物理ルート … /driver/company/consult（next.config.ts の doratechSubpages で書き換え）
 *
 * 求職者向けLP（driver.taxidriver-beginner.com）と同じ「FV画像＋選択式の質問に答えて進む」形式。
 * 縦長の説明LP（/driver/company）とは別ページで、既存のLPには手を入れていない。
 * Meta Pixel は app/driver/company/layout.tsx の企業向けPixelを引き継ぐ。
 * 広告の着地ページ用のため、検索結果には出さない（noindex）。
 */

const TITLE = "売上を上げるための採用を。｜20〜30代ドライバーの採用相談｜ドラテク";
const DESCRIPTION =
  "20〜30代のドライバーを採用したい運送会社向けの無料オンライン相談。成果報酬・月額の2つのプランから選べます。かんたんな質問に答えてお申し込みください。";

export const metadata: Metadata = {
  metadataBase: new URL("https://doratech.adofy-site.com"),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/consult" },
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/consult",
    siteName: "ドラテク",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/images/driver/company/consult-fv-v2.webp", width: 1448, height: 1086, alt: "ドラテク" }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#1e40af" };

export default function DriverCompanyConsultPage() {
  return <ConsultContent />;
}
