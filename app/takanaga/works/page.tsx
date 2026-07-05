import type { Metadata } from "next";
import { siteConfig } from "@/data/takanaga/siteConfig";
import PageHero from "@/components/takanaga/common/PageHero";
import CTASection from "@/components/takanaga/common/CTASection";
import WorksClient from "@/components/takanaga/works/WorksClient";

export const metadata: Metadata = {
  title: "施工事例｜岐阜・愛知・三重の外構工事",
  description: "高長建設の外構工事施工事例。駐車場・土間コンクリート・カーポート・フェンス・玄関アプローチ・人工芝など岐阜・愛知・三重のリフォーム実績をBefore/Afterでご紹介します。",
  alternates: { canonical: `https://${siteConfig.domain}/works` },
};

export default function WorksPage() {
  return (
    <>
      <PageHero
        eyebrow="Works"
        title="外構工事の施工事例"
        subtitle="高長建設が岐阜県・愛知県・三重県で施工した外構工事の事例をご紹介します。駐車場・土間コンクリート、カーポート、フェンス、玄関アプローチ、人工芝・庭リフォームなどの実績を、施工前後（Before・After）の写真と施工内容とあわせてご確認いただけます。"
        path="/works"
        breadcrumbs={[{ label: "施工事例" }]}
      />
      <WorksClient />
      <CTASection />
    </>
  );
}
