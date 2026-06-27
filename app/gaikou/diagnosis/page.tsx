import type { Metadata } from "next";
import GaikouDiagnosis from "./GaikouDiagnosis";

export const metadata: Metadata = {
  title: "外構プラン無料診断｜岐阜・愛知・三重の外構リフォーム",
  description:
    "7つの質問に答えるだけで、あなたに合った外構リフォームプランが分かります。最短1分・現地調査やお見積もりは無料です。",
};

export default function GaikouDiagnosisPage() {
  return <GaikouDiagnosis />;
}
