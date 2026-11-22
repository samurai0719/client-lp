import type { Metadata } from "next";
import SingleMetaPixel from "@/components/analytics/SingleMetaPixel";
import PopupLp from "@/components/popup-lp/PopupLp";

/**
 * レバウェル看護の1画面LP（/levwell-popup）。/levjob-popup の看護師版。
 * 背景は看護師の写真（public/images/nurse-shukyu3/nurse-photo.jpg）、その上に「あなたの今のお気持ちは？」。どちらを押してもA8リンクへ。
 * Meta Pixel は 533491373010800（このページ専用）。
 */
const AFFILIATE_URL =
  "https://px.a8.net/svt/ejp?a8mat=459LBM+48F16Q+2JK4+5YJRM";
const PIXEL_ID = "533491373010800";

export const metadata: Metadata = {
  title: "看護師の転職 | 希望に合う求人を無料で確認",
  description:
    "転職を考えている看護師の方へ。今のお気持ちを選んで、レバウェル看護で求人を無料で確認できます。",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <SingleMetaPixel id={PIXEL_ID} />
      <PopupLp
        prLabel="【PR】レバウェル看護"
        background={{
          src: "/images/nurse-shukyu3/nurse-photo.jpg",
          position: "center 20%",
        }}
        lead="＼ 看護師の求人を無料でチェック ／"
        question="あなたの今のお気持ちは？"
        choices={[
          {
            label: "近いうちに転職したい",
            color: "#e9736f",
            shadow: "#c4524e",
          },
          { label: "今は情報収集したい", color: "#4caf7f", shadow: "#378a62" },
        ]}
        affiliateUrl={AFFILIATE_URL}
        theme={{ card: "#fdeeee", accent: "#e06a66" }}
        note="本ページはアフィリエイト広告です。紹介サービス：レバウェル看護"
      />
    </>
  );
}
