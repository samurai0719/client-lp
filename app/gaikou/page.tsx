import type { Metadata } from "next";
import Script from "next/script";
import GaikouLandingPage from "./GaikouLandingPage";
import TakanagaMetaPixel from "@/components/analytics/TakanagaMetaPixel";

export const metadata: Metadata = {
  title: "高長建設｜岐阜県の外構リフォーム・駐車場コンクリート工事",
  description:
    "高長建設｜岐阜県で駐車場コンクリート、庭リフォーム、雑草対策、カーポート、フェンス工事に対応。現地調査・見積もり無料。施工会社が直接対応します。",
};

export default function GaikouPage() {
  return (
    <>
      <TakanagaMetaPixel />
      {/* Ptengine（高長建設LP限定） */}
      <Script id="ptengine-tag-gaikou" src="https://js.ptengine.jp/5ea63otf.js" strategy="afterInteractive" />
      <GaikouLandingPage />
    </>
  );
}
