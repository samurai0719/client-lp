import type { Metadata } from "next";
import "./takanaga-hp.css";
import Header from "@/components/takanaga/layout/Header";
import Footer from "@/components/takanaga/layout/Footer";
import { siteConfig } from "@/data/takanaga/siteConfig";
import TakanagaMetaPixel from "@/components/analytics/TakanagaMetaPixel";
import LpInsightTracker, { TAKANAGA_HP_PROJECT_ID } from "@/components/analytics/LpInsightTracker";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${siteConfig.domain}`),
  title: {
    default: `${siteConfig.siteName}｜外構リフォーム専門 岐阜・愛知・三重`,
    template: `%s${siteConfig.seo.titleSuffix}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    locale: siteConfig.seo.locale,
    siteName: siteConfig.siteName,
    images: [{ url: siteConfig.seo.ogImage, width: 1200, height: 630, alt: siteConfig.siteName }],
  },
  twitter: {
    card: siteConfig.seo.twitterCard,
    images: [siteConfig.seo.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TakanagaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="tkn-site flex flex-col min-h-screen">
      <TakanagaMetaPixel />
      {/* LP Insight: コーポレートHP全ページのヒートマップ・流入元(Google検索等)計測 */}
      <LpInsightTracker projectId={TAKANAGA_HP_PROJECT_ID} />
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <Footer />
    </div>
  );
}
