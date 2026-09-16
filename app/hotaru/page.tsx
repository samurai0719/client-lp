import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Shippori_Mincho_B1 } from "next/font/google";
import "./hotaru.css";
import { hotaruConfig as c, verifiedValue } from "@/config/hotaru";
import HotaruSite from "./_components/HotaruSite";

// 見出し：明朝体 / 本文・ナビ・ボタン：ゴシック体
// 日本語グリフは unicode-range ごとに分割配信されるため、プリロードは latin のみ
const mincho = Shippori_Mincho_B1({
  weight: ["500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--ht-font-mincho",
  fallback: ["Hiragino Mincho ProN", "Yu Mincho", "YuMincho", "HGS明朝E", "serif"],
});

const gothic = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--ht-font-gothic",
  fallback: ["Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", "sans-serif"],
});

const noindex = c.isProposal;

export const metadata: Metadata = {
  title: c.seo.title,
  description: c.seo.description,
  // 提案段階は検索エンジンに登録させない
  robots: noindex
    ? { index: false, follow: false, googleBot: { index: false, follow: false } }
    : { index: true, follow: true },
  // 本番URL確定まで canonical / og:url は出さない
  ...(c.seo.siteUrl ? { alternates: { canonical: c.seo.siteUrl } } : {}),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    title: c.seo.title,
    description: c.seo.description,
    siteName: c.shop.name,
    ...(c.seo.siteUrl ? { url: c.seo.siteUrl } : {}),
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  // iPhone のセーフエリア（env(safe-area-inset-*)）を有効にする
  viewportFit: "cover",
  themeColor: "#241C17",
};

function structuredData() {
  const hours = verifiedValue(c.hours.businessHours);
  const room = verifiedValue(c.address.room);
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: c.shop.name,
    alternateName: c.shop.nameKana,
    servesCuisine: "居酒屋",
    telephone: c.contact.phoneIntl,
    address: {
      "@type": "PostalAddress",
      addressCountry: "JP",
      addressRegion: c.address.region,
      addressLocality: c.address.locality,
      streetAddress: `${c.address.street}${room ? ` ${room}` : ""}`,
    },
    // 営業時間は店舗確認後のみ出力（価格・レビューは出力しない）
    ...(hours ? { openingHours: hours } : {}),
    ...(c.seo.siteUrl ? { url: c.seo.siteUrl } : {}),
  };
}

export default function HotaruPage() {
  return (
    <div className={`${mincho.variable} ${gothic.variable} hotaru`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData()).replace(/</g, "\\u003c"),
        }}
      />
      <HotaruSite />
    </div>
  );
}
