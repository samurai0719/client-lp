import { Shippori_Mincho } from "next/font/google";
import "../gaikou/gaikou.css";
import "./new-exterior.css";
import MotionConfigWrapper from "@/components/gaikou/MotionConfigWrapper";
import GaikouHeader from "@/components/gaikou/GaikouHeader";
import NeDecorativeBackground from "@/components/new-exterior/NeDecorativeBackground";
import HeroSection from "@/components/new-exterior/HeroSection";
import CTABlock from "@/components/new-exterior/CTABlock";
import TrustBadges from "@/components/new-exterior/TrustBadges";
import ProblemsSection from "@/components/new-exterior/ProblemsSection";
import HmCompareSection from "@/components/new-exterior/HmCompareSection";
import MeritsSection from "@/components/new-exterior/MeritsSection";
import ServicesSection from "@/components/new-exterior/ServicesSection";
import NewExteriorSimulatorSection from "@/components/new-exterior/NewExteriorSimulatorSection";
import WorksSection from "@/components/new-exterior/WorksSection";
import DesignExamplesSection from "@/components/new-exterior/DesignExamplesSection";
import StaffSection from "@/components/new-exterior/StaffSection";
import PriceSection from "@/components/new-exterior/PriceSection";
import ReasonsSection from "@/components/new-exterior/ReasonsSection";
import FlowSection from "@/components/new-exterior/FlowSection";
import NeAreaSection from "@/components/new-exterior/NeAreaSection";
import FAQSection from "@/components/new-exterior/FAQSection";
import NeReassuranceSection from "@/components/new-exterior/NeReassuranceSection";
import FinalCTASection from "@/components/new-exterior/FinalCTASection";
import Footer from "@/components/new-exterior/Footer";

// FVクリエイティブに合わせた明朝体（見出し用）。--font-ne-serif で new-exterior.css から参照する
const shipporiMincho = Shippori_Mincho({
  weight: ["500", "700"],
  subsets: ["latin"],
  variable: "--font-ne-serif",
  display: "swap",
});

export default function NewExteriorLandingPage() {
  return (
    <div className={`ne-lp ${shipporiMincho.variable} min-h-screen w-full min-w-0 overflow-x-hidden`}>
      <h1 className="sr-only">
        高長建設｜東海エリアの新築外構工事｜ハウスメーカーの新築外構が高いと感じたら、外構専門店へ直接相談。駐車場・門柱・アプローチ・フェンス・庭までまとめて対応。現地調査・お見積もり無料
      </h1>

      <GaikouHeader />

      <MotionConfigWrapper>
        <NeDecorativeBackground />

        <main className="relative z-[1]">
          {/* 1. ファーストビュー（文言込みの画像クリエイティブ） */}
          <HeroSection />

          {/* 実績メダル（お客様満足度・お問合せ数） */}
          <TrustBadges />

          <div className="relative px-4 sm:px-6 pt-6 pb-8 sm:pb-10">
            {/* ページ内で最初のCTAのみ10%OFFクーポンを表示する */}
            <CTABlock showCoupon />
          </div>

          {/* 施工事例（FV直下で実例と価格感を先に見せる） */}
          <WorksSection />

          {/* スタッフ紹介（私たちにお任せください） */}
          <StaffSection />

          {/* 外構デザイン例 */}
          <DesignExamplesSection />

          {/* 新築外構でよくある悩み */}
          <ProblemsSection />

          {/* 3. ハウスメーカー経由が高くなりやすい理由 */}
          <HmCompareSection />

          {/* 4. 外構専門会社へ直接相談するメリット */}
          <MeritsSection />

          {/* 5. 対応できる工事内容 */}
          <ServicesSection />

          {/* 新築×外構シミュレーター */}
          <NewExteriorSimulatorSection />

          {/* 料金目安 */}
          <PriceSection />

          {/* 8. 選ばれる理由 */}
          <ReasonsSection />

          {/* 9. 相談から施工までの流れ */}
          <FlowSection />

          {/* 10. 対応エリア */}
          <NeAreaSection />

          {/* 11. よくある質問 */}
          <FAQSection />

          <NeReassuranceSection />

          {/* 診断フォームCTA（診断フォーム本体は /new-exterior/diagnosis） */}
          <FinalCTASection />
        </main>

        <Footer />
      </MotionConfigWrapper>
    </div>
  );
}
