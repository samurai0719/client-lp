import type { Metadata } from "next";
import { siteConfig } from "@/data/takanaga/siteConfig";
import PageHero from "@/components/takanaga/common/PageHero";
import ContactForm from "@/components/takanaga/contact/ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ・無料現地調査のご依頼",
  description: "高長建設への外構工事のお問い合わせ・無料現地調査のご依頼はこちら。岐阜・愛知・三重エリアの駐車場・カーポート・フェンス・玄関アプローチ工事のご相談を承ります。",
  alternates: { canonical: `https://${siteConfig.domain}/contact` },
  robots: { index: false, follow: true },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="お問い合わせ・無料現地調査のご依頼"
        subtitle="現地調査・お見積もりは無料です。お気軽にご相談ください。"
        breadcrumbs={[{ label: "お問い合わせ" }]}
      />
      <ContactForm />
    </>
  );
}
