import type { Metadata } from "next";
import Script from "next/script";
import GaikouDiagnosis from "./GaikouDiagnosis";
import TakanagaMetaPixel from "@/components/analytics/TakanagaMetaPixel";

export const metadata: Metadata = {
  title: "外構プラン無料診断｜岐阜・愛知・三重の外構リフォーム",
  description:
    "7つの質問に答えるだけで、あなたに合った外構リフォームプランが分かります。最短1分・現地調査やお見積もりは無料です。",
};

export default function GaikouDiagnosisPage() {
  return (
    <>
      <TakanagaMetaPixel />
      {/* Ptengine（外構プラン無料診断ページ限定） */}
      <Script id="ptengine-tag-diagnosis" src="https://js.ptengine.jp/2b4rnqyi.js" strategy="afterInteractive" />
      <GaikouDiagnosis />
    </>
  );
}
