import type { Metadata } from "next";
import { siteConfig } from "@/data/takanaga/siteConfig";
import GaikouDiagnosis from "@/app/gaikou/diagnosis/GaikouDiagnosis";

export const metadata: Metadata = {
  title: "AIシミュレーション",
  description:
    "7つの質問に答えるだけで、あなたに合った外構リフォームプランが分かります。現地調査・お見積もりは無料です。",
  alternates: { canonical: `https://${siteConfig.domain}/simulation` },
};

export default function SimulationPage() {
  return <GaikouDiagnosis />;
}
