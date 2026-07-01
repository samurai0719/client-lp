import type { Metadata } from "next";
import { siteConfig } from "@/data/takanaga/siteConfig";
import ExteriorSimulatorSection from "@/components/gaikou/ExteriorSimulatorSection";
import "@/app/gaikou/gaikou.css";

export const metadata: Metadata = {
  title: "AIシミュレーション",
  description:
    "自宅の写真を撮るだけ。外構リフォーム後の完成イメージをAIがシミュレーションします。現地調査・お見積もりは無料です。",
  alternates: { canonical: `https://${siteConfig.domain}/simulation` },
};

export default function SimulationPage() {
  return (
    // gaikou.css の CSS変数を提供するラッパー（ExteriorSimulatorSection がこれらを参照する）
    <div
      style={{
        "--gaikou-green-deep": "#10302a",
        "--gaikou-green": "#1f4d3d",
        "--gaikou-green-bright": "#2f7d5a",
        "--gaikou-orange": "#d9601a",
        "--gaikou-beige": "#f9f7f1",
        "--gaikou-cream": "#fdfbf6",
      } as React.CSSProperties}
    >
      <ExteriorSimulatorSection />
    </div>
  );
}
