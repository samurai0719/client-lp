import type { Metadata } from "next";
import GaikouDiagnosis from "@/app/gaikou/diagnosis/GaikouDiagnosis";

export const metadata: Metadata = {
  title: "外構プラン無料診断｜高長建設",
  description:
    "7つの質問に答えるだけで、あなたに合った外構リフォームプランが分かります。最短1分・現地調査やお見積もりは無料です。",
  alternates: {
    canonical: "https://takanagakensetu.com/lp/gaikou-reform/diagnosis",
  },
};

export default function LpDiagnosisPage() {
  return <GaikouDiagnosis />;
}
