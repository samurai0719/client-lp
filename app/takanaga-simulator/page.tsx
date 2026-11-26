import type { Metadata } from "next";
import ExteriorSimulatorSection from "@/components/gaikou/ExteriorSimulatorSection";
import "@/app/gaikou/gaikou.css";

/**
 * 高永建設 外構AIシミュレーション（シミュレーションのみの単独ページ）
 * 公開URL: https://takanaga-simulator.vercel.app/ （next.config.ts の beforeFiles で / をここへ書き換え）
 */
export const metadata: Metadata = {
  title: "外構AIシミュレーション｜高永建設",
  description: "自宅の写真を撮るだけで、外構リフォーム後の完成イメージをAIがシミュレーションします。",
  robots: { index: false, follow: false },
};

export default function TakanagaSimulatorPage() {
  return (
    <div className="gaikou-lp">
      <ExteriorSimulatorSection />
    </div>
  );
}
