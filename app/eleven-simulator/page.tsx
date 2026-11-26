import type { Metadata } from "next";
import ExteriorSimulatorSection from "@/components/gaikou/ExteriorSimulatorSection";
import "@/app/gaikou/gaikou.css";

/**
 * 外構AIシミュレーション（シミュレーションのみの単独ページ）
 * 公開URL: https://eleven-simulator.vercel.app/ （next.config.ts の beforeFiles で / をここへ書き換え）
 */
export const metadata: Metadata = {
  title: "外構AIシミュレーション",
  description: "自宅の写真を撮るだけで、外構リフォーム後の完成イメージをAIがシミュレーションします。",
  robots: { index: false, follow: false },
};

export default function ElevenSimulatorPage() {
  return (
    <div className="gaikou-lp">
      <ExteriorSimulatorSection />
    </div>
  );
}
