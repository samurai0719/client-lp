import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import SingleMetaPixel from "@/components/analytics/SingleMetaPixel";
import LevjobDriverContent from "@/components/levjob-driver/LevjobDriverContent";
import { DESCRIPTION, LEVJOB_DRIVER_PIXEL_ID, TITLE } from "@/components/levjob-driver/config";
import "./levjob-driver.css";

const gothic = Noto_Sans_JP({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--lj-font",
  fallback: ["Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", "sans-serif"],
});

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // 広告からの流入専用の記事LP。検索には載せない
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0f2a4a",
};

/**
 * レバジョブ（ドライバー）を紹介するアンケート型の記事LP（/levjob-driver）。
 * 文言・リンク・画像・Pixel は components/levjob-driver/config.ts。
 */
export default function Page() {
  return (
    <div className={gothic.variable}>
      <SingleMetaPixel id={LEVJOB_DRIVER_PIXEL_ID} />
      <LevjobDriverContent />
    </div>
  );
}
