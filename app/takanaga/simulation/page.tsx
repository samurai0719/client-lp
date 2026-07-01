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
    <div className="gaikou-lp">
      <ExteriorSimulatorSection />
    </div>
  );
}
