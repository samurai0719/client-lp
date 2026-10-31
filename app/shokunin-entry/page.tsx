import type { Metadata, Viewport } from "next";
import AdofyMetaPixel from "@/components/analytics/AdofyMetaPixel";
import EntryContent from "@/components/shokunin-entry/EntryContent";

const URL_BASE = "https://saiyo.adofy-site.com";
const TITLE = "建設職人の転職・仕事探し｜職人採用エージェント";
const DESCRIPTION =
  "建設職人に特化した無料登録サービス。職種・経験・資格・希望条件を登録すると、あなたの匿名プロフィールを見た建設会社から面接希望が届きます。面接するかは条件を確認してから自分で決められます。";

export const metadata: Metadata = {
  metadataBase: new URL(URL_BASE),
  alternates: { canonical: "/shokunin-entry" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "職人採用エージェント",
    url: "/shokunin-entry",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/images/shokunin-entry/og.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/images/shokunin-entry/og.jpg"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function ShokuninEntryPage() {
  return (
    <>
      <AdofyMetaPixel />
      <EntryContent />
    </>
  );
}
