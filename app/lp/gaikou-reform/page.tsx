import type { Metadata } from "next";
import GaikouLandingPage from "@/app/gaikou/GaikouLandingPage";

export const metadata: Metadata = {
  title: "高長建設｜岐阜県の外構リフォーム・駐車場コンクリート工事",
  description:
    "高長建設｜岐阜県で駐車場コンクリート、庭リフォーム、雑草対策、カーポート、フェンス工事に対応。現地調査・見積もり無料。施工会社が直接対応します。",
  alternates: {
    canonical: "https://takanagakensetu.com/lp/gaikou-reform",
  },
  openGraph: {
    title: "高長建設｜岐阜県の外構リフォーム・駐車場コンクリート工事",
    description:
      "高長建設｜岐阜県で駐車場コンクリート、庭リフォーム、雑草対策、カーポート、フェンス工事に対応。現地調査・見積もり無料。施工会社が直接対応します。",
    url: "https://takanagakensetu.com/lp/gaikou-reform",
  },
};

export default function LpGaikouReformPage() {
  return <GaikouLandingPage />;
}
