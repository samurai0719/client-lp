import type { Metadata } from "next";
import { siteConfig } from "@/data/takanaga/siteConfig";
import PageHero from "@/components/takanaga/common/PageHero";
import CTASection from "@/components/takanaga/common/CTASection";
import WorksClient from "@/components/takanaga/works/WorksClient";

export const metadata: Metadata = {
  title: "施工事例",
  description: "高長建設の外構工事施工事例。駐車場・土間コンクリート・カーポート・フェンス・玄関アプローチ・人工芝など岐阜・愛知・三重のリフォーム実績をBefore/Afterでご紹介します。",
  alternates: { canonical: `https://${siteConfig.domain}/works` },
};

export default function WorksPage() {
  return (
    <>
      <PageHero
        eyebrow="Works"
        title="施工事例"
        subtitle="実際のBefore・Afterをご確認いただけます。"
        breadcrumbs={[{ label: "施工事例" }]}
      />
      <WorksClient />
      <CTASection />
    </>
  );
}
