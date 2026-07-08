import type { Metadata } from "next";
import NewExteriorDiagnosis from "./NewExteriorDiagnosis";
import TakanagaMetaPixel from "@/components/analytics/TakanagaMetaPixel";

export const metadata: Metadata = {
  title: "新築外構 無料診断｜岐阜・愛知・三重の新築外構工事",
  description:
    "7つの質問に答えるだけで、新築のお住まいに合った外構プランと概算が分かります。最短30秒・現地調査やお見積もりは無料です。",
  // 広告からのCV用フォームページのため検索結果には出さない
  robots: { index: false, follow: true },
};

export default function NewExteriorDiagnosisPage() {
  return (
    <>
      <TakanagaMetaPixel />
      <NewExteriorDiagnosis />
    </>
  );
}
