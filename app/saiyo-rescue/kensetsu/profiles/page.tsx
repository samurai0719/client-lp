import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { ArrowLeft } from "lucide-react";
import "../../saiyo-rescue.css";
import "../kensetsu.css";

import { Footer, Header, SampleProfileCard } from "@/components/saiyo-rescue-kensetsu/Sections";
import InterviewModal from "@/components/saiyo-rescue-kensetsu/InterviewModal";
import AttributionCapture from "@/components/saiyo-rescue/AttributionCapture";
import AdofyMetaPixel from "@/components/analytics/AdofyMetaPixel";
import {
  BRAND,
  DISCLOSE_LABEL,
  LP_HREF_FROM_PROFILES,
  PROFILES_PATH,
  SAMPLE_PROFILES,
  SITE,
  SITE_ORIGIN,
} from "@/components/saiyo-rescue-kensetsu/config";

const gothic = Noto_Sans_JP({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--sr-font",
  fallback: ["Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Meiryo", "sans-serif"],
});

const TITLE = `建設業の求職者 匿名プロフィール一覧｜${SITE.name}`;
const DESCRIPTION =
  "建設会社向けに、職人・現場スタッフの求職者の匿名プロフィール（年代・資格・経験・希望勤務地・希望年収）を登録なしで確認できます。面接したい人を選ぶと、採用レスキューが連絡と面接の日程調整を行います。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  alternates: { canonical: PROFILES_PATH },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "採用レスキュー",
    url: PROFILES_PATH,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: SITE.ogImage, width: SITE.ogW, height: SITE.ogH }],
  },
  // 表示例しかない間は検索結果に出さない（実在の求職者を掲載し始めたら index に戻す）
  robots: { index: false, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

/**
 * 建設業の求職者の匿名プロフィール一覧（公開URL saiyo.adofy-site.com/kensetsu/profiles）。
 * LPの「無料で求職者情報を見てみる」から来る。登録なしで閲覧でき、
 * 「この方と面接を希望する」を押すとライトボックスで会社の無料登録フォームが開く。
 *
 * 建設業の求職者はまだ登録がないため、現在は「架空の表示例」のカードだけを出している。
 * 求職者の登録・公開の仕組みを作ったら、ここで実データのカード（候補者番号つき）を出す。
 */
export default function SaiyoRescueKensetsuProfilesPage() {
  return (
    <div className={`sr-lp ks-lp ${gothic.variable}`}>
      <AdofyMetaPixel />
      <AttributionCapture />
      <Header cta={false} />
      <main>
        <section className="ks-section ks-profiles" aria-labelledby="ks-profiles-title">
          <div className="sr-container">
            <a href={LP_HREF_FROM_PROFILES} className="ks-profiles__back">
              <ArrowLeft aria-hidden="true" />
              サービスの説明に戻る
            </a>
            <header className="ks-head">
              <p className="ks-head__label">
                <span className="ks-head__no">＊</span>
                <span className="ks-head__en">PROFILES</span>
                <span className="ks-head__jp">求職者の情報</span>
              </p>
              <h1 className="ks-head__title" id="ks-profiles-title">
                建設業の求職者
                <wbr />
                匿名プロフィール
              </h1>
              <p className="ks-head__lead">
                個人を特定できる情報は表示していません。面接したい方がいれば「{DISCLOSE_LABEL}」から無料登録できます。ご契約後、{BRAND}
                が求職者に連絡し、面接の日程を調整します。
              </p>
            </header>

            <p className="ks-profiles__empty">
              現在、公開中のプロフィールはありません。新しい登録があり次第、ここに表示されます。
              <br />
              下は、プロフィールがどのように表示されるかの<strong>架空の例</strong>です。
            </p>

            <div className="ks-profiles__grid">
              {SAMPLE_PROFILES.map((p, i) => (
                <SampleProfileCard key={i} rows={p.rows} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <InterviewModal />
    </div>
  );
}
