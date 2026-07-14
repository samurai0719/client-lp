import "./gaikou.css";
import DecorativeBackground from "@/components/gaikou/DecorativeBackground";
import MotionConfigWrapper from "@/components/gaikou/MotionConfigWrapper";
import SectionDivider from "@/components/gaikou/SectionDivider";
import HeroSection from "@/components/gaikou/HeroSection";
import HeroCtaSection from "@/components/gaikou/HeroCtaSection";
import DirectAppealSection from "@/components/gaikou/DirectAppealSection";
import CTABlock from "@/components/gaikou/CTABlock";
import WorksGrid from "@/components/gaikou/WorksGrid";
import StaffSection from "@/components/gaikou/StaffSection";
import ProblemsSection from "@/components/gaikou/ProblemsSection";
import SolutionsSection from "@/components/gaikou/SolutionsSection";
import ServicesSection from "@/components/gaikou/ServicesSection";
import ExteriorSimulatorSection from "@/components/gaikou/ExteriorSimulatorSection";
import ReasonsSection from "@/components/gaikou/ReasonsSection";
import PriceSection from "@/components/gaikou/PriceSection";
import PriceIncludesSection from "@/components/gaikou/PriceIncludesSection";
import AdditionalCostSection from "@/components/gaikou/AdditionalCostSection";
import QualitySection from "@/components/gaikou/QualitySection";
import FlowSection from "@/components/gaikou/FlowSection";
import PlanSection from "@/components/gaikou/PlanSection";
import WarrantySection from "@/components/gaikou/WarrantySection";
import FAQSection from "@/components/gaikou/FAQSection";
import AreaSection from "@/components/gaikou/AreaSection";
import ReassuranceSection from "@/components/gaikou/ReassuranceSection";
import ContactSection from "@/components/gaikou/ContactSection";
import Footer from "@/components/gaikou/Footer";
import GaikouHeader from "@/components/gaikou/GaikouHeader";
import GaikouFixedCta from "@/components/gaikou/GaikouFixedCta";

// セクションの並びはCV優先度順：
// FV＋CTA → 直接依頼の理由 → 施工事例 → お客様の声 → 料金 → 選ばれる理由 →
// 流れ → シミュレーター（CV導線の後ろに配置） → 悩み・解決 → 対応工事 →
// 品質・プラン・保証 → FAQ → 対応エリア → 安心情報 → お問い合わせ
export default function GaikouLandingPage() {
  return (
    <div className="gaikou-lp min-h-screen w-full min-w-0 overflow-x-hidden">
      <h1 className="sr-only">
        高長建設｜岐阜県の外構リフォーム・駐車場コンクリート工事｜砂利・雑草・使いづらいお庭を、手入れのいらない快適な外構へ。現地調査・お見積もり無料、施工会社が直接対応
      </h1>

      <GaikouHeader />

      <MotionConfigWrapper>
        <DecorativeBackground />

        <main className="relative z-[1]">
          {/* 1. ファーストビュー＋画面内CTA */}
          <HeroSection />
          <HeroCtaSection />
          <SectionDivider color="#fdfbf6" />

          {/* 2. 直接依頼で中間コストを抑えられる理由（広告訴求の補強） */}
          <DirectAppealSection />

          {/* 3. 施工事例 */}
          <WorksGrid />

          {/* 4. お客様の声：実際の声が揃うまで一時非表示（2026-07-14 オーナー指示）。
              復活時は components/gaikou/TestimonialsSection を再インポートして
              data/gaikou/testimonials.ts を本物の声に差し替える */}

          {/* 5. 料金目安 */}
          <PriceSection />
          <PriceIncludesSection />
          <AdditionalCostSection />

          {/* 6. 選ばれる理由・スタッフ */}
          <ReasonsSection />
          <StaffSection />

          {/* 7. 工事の流れ */}
          <FlowSection />

          {/* AIシミュレーター（機能は維持しつつ、CV導線の後ろに配置） */}
          <ExteriorSimulatorSection />

          {/* 補足情報：悩み・解決策、対応工事、品質・プラン・保証 */}
          <ProblemsSection />
          <SolutionsSection />
          <ServicesSection />
          <QualitySection />
          <PlanSection />
          <WarrantySection />

          {/* 8. FAQ / 9. 対応エリア */}
          <FAQSection />
          <AreaSection />
          <ReassuranceSection />

          <div className="relative px-4 sm:px-6 pb-14 sm:pb-16 text-center">
            <CTABlock />
          </div>

          {/* 10. お問い合わせ */}
          <ContactSection />
        </main>

        <Footer />
        {/* スマホ専用：画面下部の固定CTA（フォーム付近では非表示） */}
        <GaikouFixedCta />
      </MotionConfigWrapper>
    </div>
  );
}
