import "./gaikou.css";
import DecorativeBackground from "@/components/gaikou/DecorativeBackground";
import MotionConfigWrapper from "@/components/gaikou/MotionConfigWrapper";
import SectionDivider from "@/components/gaikou/SectionDivider";
import HeroSection from "@/components/gaikou/HeroSection";
import CTABlock from "@/components/gaikou/CTABlock";
import WorksGrid from "@/components/gaikou/WorksGrid";
import ProblemsSection from "@/components/gaikou/ProblemsSection";
import SolutionsSection from "@/components/gaikou/SolutionsSection";
import DirectModelSection from "@/components/gaikou/DirectModelSection";
import ServicesSection from "@/components/gaikou/ServicesSection";
import ExteriorSimulatorSection from "@/components/gaikou/ExteriorSimulatorSection";
import ReasonsSection from "@/components/gaikou/ReasonsSection";
import PriceSection from "@/components/gaikou/PriceSection";
import PriceIncludesSection from "@/components/gaikou/PriceIncludesSection";
import AdditionalCostSection from "@/components/gaikou/AdditionalCostSection";
import QualitySection from "@/components/gaikou/QualitySection";
import FlowSection from "@/components/gaikou/FlowSection";
import PlanSection from "@/components/gaikou/PlanSection";
import CompanySection from "@/components/gaikou/CompanySection";
import WarrantySection from "@/components/gaikou/WarrantySection";
import FAQSection from "@/components/gaikou/FAQSection";
import AreaSection from "@/components/gaikou/AreaSection";
import ReassuranceSection from "@/components/gaikou/ReassuranceSection";
import ContactSection from "@/components/gaikou/ContactSection";
import Footer from "@/components/gaikou/Footer";
import GaikouHeader from "@/components/gaikou/GaikouHeader";

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
          <HeroSection />
          <SectionDivider color="#fdfbf6" />

          <div className="relative px-4 sm:px-6 pt-0 pb-8 sm:pb-10">
            <CTABlock />
          </div>

          <WorksGrid />
          <ExteriorSimulatorSection />
          <SectionDivider color="#fdfbf6" />

          <ProblemsSection />
          <SolutionsSection />
          <DirectModelSection />
          <ServicesSection />
          <ReasonsSection />
          <PriceSection />
          <PriceIncludesSection />
          <AdditionalCostSection />
          <QualitySection />
          <FlowSection />
          <PlanSection />
          <CompanySection />
          <WarrantySection />
          <FAQSection />
          <AreaSection />
          <ReassuranceSection />

          <div className="relative px-4 sm:px-6 pb-14 sm:pb-16 text-center">
            <CTABlock />
          </div>

          <ContactSection />
        </main>

        <Footer />
      </MotionConfigWrapper>
    </div>
  );
}
