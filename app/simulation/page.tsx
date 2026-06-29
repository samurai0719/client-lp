import type { Metadata } from "next";
import GaikouDiagnosis from "@/app/gaikou/diagnosis/GaikouDiagnosis";

export const metadata: Metadata = {
  title: "AI外構シミュレーター｜高長建設",
  description:
    "写真をアップロードするだけで、外構リフォームの完成イメージをAIが自動生成。駐車場・カーポート・フェンス・お庭の仕上がりを事前に確認できます。",
  alternates: {
    canonical: "https://takanagakensetu.com/simulation",
  },
  openGraph: {
    title: "AI外構シミュレーター｜高長建設",
    description:
      "写真をアップロードするだけで、外構リフォームの完成イメージをAIが自動生成。",
    url: "https://takanagakensetu.com/simulation",
  },
};

export default function SimulationPage() {
  return <GaikouDiagnosis />;
}
