import type { Metadata } from "next";
import NewExteriorLandingPage from "./NewExteriorLandingPage";
import TakanagaMetaPixel from "@/components/analytics/TakanagaMetaPixel";

export const metadata: Metadata = {
  title: "新築外構を安く・おしゃれに｜東海エリアの新築外構工事｜高長建設",
  description:
    "高長建設｜岐阜・愛知・三重で新築外構工事に対応。駐車場コンクリート、カーポート、門柱、フェンス、アプローチ、庭まで建物に合う外構プランを無料でご提案。現地調査・見積もり無料。ハウスメーカー見積もりとの比較相談も可能です。",
  alternates: {
    canonical: "https://www.takanagakensetu.com/new-exterior",
  },
  // 広告流入用LPのため、会社名検索でコーポレートHP（/）と競合させない
  robots: { index: false, follow: true },
};

export default function NewExteriorPage() {
  return (
    <>
      <TakanagaMetaPixel />
      <NewExteriorLandingPage />
    </>
  );
}
