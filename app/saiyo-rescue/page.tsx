import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./saiyo-rescue.css";

import Header from "@/components/saiyo-rescue/Header";
import Hero from "@/components/saiyo-rescue/Hero";
import Results from "@/components/saiyo-rescue/Results";
import Problems from "@/components/saiyo-rescue/Problems";
import Benefits from "@/components/saiyo-rescue/Benefits";
import Trust from "@/components/saiyo-rescue/Trust";
import Steps from "@/components/saiyo-rescue/Steps";
import FAQ from "@/components/saiyo-rescue/FAQ";
import Pricing from "@/components/saiyo-rescue/Pricing";
import CTA from "@/components/saiyo-rescue/CTA";
import Footer from "@/components/saiyo-rescue/Footer";
import StickyCta from "@/components/saiyo-rescue/StickyCta";
import AttributionCapture from "@/components/saiyo-rescue/AttributionCapture";
import AdofyMetaPixel from "@/components/analytics/AdofyMetaPixel";
import { HERO_IMAGE, SITE } from "@/components/saiyo-rescue/config";

// 日本語グリフは unicode-range ごとに分割配信されるため、プリロードは latin のみ
const gothic = Noto_Sans_JP({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--sr-font",
  fallback: ["Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://saiyo.adofy-site.com"),
  alternates: { canonical: "/" },
  title: SITE.title,
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    images: [{ url: HERO_IMAGE.pc, width: HERO_IMAGE.pcW, height: HERO_IMAGE.pcH }],
  },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description, images: [HERO_IMAGE.pc] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function SaiyoRescuePage() {
  return (
    <div className={`sr-lp ${gothic.variable}`}>
      {/* JSが無効な環境では、カウントアップ前の透明状態のまま残らないよう数字を最初から表示する */}
      <noscript
        dangerouslySetInnerHTML={{ __html: "<style>.sr-count{opacity:1!important;transform:none!important}</style>" }}
      />
      <AdofyMetaPixel />
      <AttributionCapture />
      <Header />
      <main>
        <Hero />
        <Results />
        <Problems />
        <Benefits />
        <Trust />
        <Steps />
        <FAQ />
        <Pricing />
        <CTA />
      </main>
      <Footer />
      <StickyCta />
    </div>
  );
}
