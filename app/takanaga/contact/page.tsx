import type { Metadata } from "next";
import { siteConfig } from "@/data/takanaga/siteConfig";
import PageHero from "@/components/takanaga/common/PageHero";
import ContactForm from "@/components/takanaga/contact/ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ・無料見積もり",
  description: "高長建設への外構工事のお問い合わせ・無料現地調査のご依頼はこちら。岐阜・愛知・三重エリアの駐車場・カーポート・フェンス・玄関アプローチ工事のご相談を承ります。",
  alternates: { canonical: `https://${siteConfig.domain}/contact` },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="お問い合わせ・無料見積もり"
        subtitle="高長建設への外構工事のご相談・無料見積もりのご依頼はこちらから。岐阜県・愛知県・三重県で、駐車場コンクリート・カーポート・フェンス・庭リフォームなどに対応しています。現地調査とお見積もりは無料で、お断りいただいても費用はかかりません。"
        path="/contact"
        breadcrumbs={[{ label: "お問い合わせ" }]}
      />
      <ContactForm />
    </>
  );
}
