import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "../saiyo-rescue/saiyo-rescue.css";
import "../saiyo-rescue/kensetsu/kensetsu.css";
import "./shokunin.css";

import { Header, StickyCta } from "@/components/shokunin-agent/Chrome";
import {
  BeforeAfter,
  Contact,
  Cost,
  FAQ,
  Flow,
  Footer,
  Hero,
  Pricing,
  Results,
  Scope,
  ServiceFlow,
  Strengths,
  Worry,
} from "@/components/shokunin-agent/Sections";
import { SITE } from "@/components/shokunin-agent/config";
import AttributionCapture from "@/components/saiyo-rescue/AttributionCapture";
import AdofyMetaPixel from "@/components/analytics/AdofyMetaPixel";

// 日本語グリフは unicode-range ごとに分割配信されるため、プリロードは latin のみ
const gothic = Noto_Sans_JP({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--sr-font",
  fallback: ["Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.origin),
  alternates: { canonical: SITE.path },
  title: SITE.title,
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "職人採用エージェント",
    url: SITE.path,
    title: SITE.title,
    description: SITE.description,
    images: [{ url: SITE.ogImage, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description, images: [SITE.ogImage] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

/** 職人採用エージェント LP。デザインは建設業LP（/kensetsu）の ks- 部品を土台に、固有部分を sa- で足している */
export default function ShokuninAgentPage() {
  return (
    <div className={`sr-lp ks-lp sa-lp ${gothic.variable}`}>
      {/* JSが無効な環境では、カウントアップ前の透明状態のまま残らないよう数字を最初から表示する */}
      <noscript
        dangerouslySetInnerHTML={{ __html: "<style>.sr-count{opacity:1!important;transform:none!important}</style>" }}
      />
      <AdofyMetaPixel />
      <AttributionCapture />
      <Header />
      <main>
        <Hero />
        <Cost />
        <Worry />
        <ServiceFlow />
        <BeforeAfter />
        <Scope />
        <Strengths />
        <Results />
        <Pricing />
        <Flow />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <StickyCta />
    </div>
  );
}
