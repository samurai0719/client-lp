import type { Metadata } from "next";
import GaihekiColorSimulator from "@/app/gaiheki/components/GaihekiColorSimulator";

/**
 * 高永建設 外壁・屋根の塗装AIシミュレーション（シミュレーションのみの単独ページ）
 * 公開URL: https://takanaga-paint-simulator.vercel.app/ （next.config.ts の beforeFiles で / をここへ書き換え）
 */
export const metadata: Metadata = {
  title: "外壁・屋根 塗装AIシミュレーション｜高永建設",
  description: "自宅の写真をアップロードするだけで、外壁・屋根の塗装後の完成イメージをAIがシミュレーションします。",
  robots: { index: false, follow: false },
};

export default function TakanagaPaintSimulatorPage() {
  return (
    <main className="min-h-screen" style={{ background: "#f8fafc" }}>
      <GaihekiColorSimulator />
    </main>
  );
}
