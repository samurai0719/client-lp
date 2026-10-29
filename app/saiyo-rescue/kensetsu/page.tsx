import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "../saiyo-rescue.css";
import "./kensetsu.css";

import {
  Delegate,
  FAQ,
  FinalCta,
  Footer,
  Header,
  Hero,
  Intro,
  Pricing,
  Problems,
  Reasons,
  Results,
  Retention,
  Steps,
} from "@/components/saiyo-rescue-kensetsu/Sections";
import StickyCta from "@/components/saiyo-rescue-kensetsu/StickyCta";
import AttributionCapture from "@/components/saiyo-rescue/AttributionCapture";
import AdofyMetaPixel from "@/components/analytics/AdofyMetaPixel";
import { SITE, SITE_ORIGIN, SITE_PATH } from "@/components/saiyo-rescue-kensetsu/config";

// 日本語グリフは unicode-range ごとに分割配信されるため、プリロードは latin のみ
const gothic = Noto_Sans_JP({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--sr-font",
  fallback: ["Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  alternates: { canonical: SITE_PATH },
  title: SITE.title,
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "採用レスキュー",
    url: SITE_PATH,
    title: SITE.title,
    description: SITE.description,
    images: [{ url: SITE.ogImage, width: SITE.ogW, height: SITE.ogH }],
  },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description, images: [SITE.ogImage] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

/**
 * 採用レスキュー 建設業向けLP。
 * 公開URL：saiyo.adofy-site.com/kensetsu（next.config.ts の rewrite でこの物理ルートを配信）
 * CTAはすべて匿名プロフィール一覧（/kensetsu/profiles）へ進む。フォームは一覧ページのライトボックスにある。
 */
export default function SaiyoRescueKensetsuPage() {
  return (
    <div className={`sr-lp ks-lp ${gothic.variable}`}>
      {/* JSが無効な環境では、カウントアップ前の透明状態のまま残らないよう数字を最初から表示する */}
      <noscript
        dangerouslySetInnerHTML={{ __html: "<style>.sr-count{opacity:1!important;transform:none!important}</style>" }}
      />
      <AdofyMetaPixel />
      <AttributionCapture />
      <Header />
      <main>
        <Hero />
        <Intro />
        <Problems />
        <Reasons />
        <Retention />
        <Delegate />
        <Results />
        <Pricing />
        <Steps />
        <FAQ />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta />
    </div>
  );
}
