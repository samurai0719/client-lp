import type { Metadata } from 'next';
import SingleMetaPixel from '@/components/analytics/SingleMetaPixel';
import PopupLp from '@/components/popup-lp/PopupLp';
import { LEVJOB_DRIVER_PIXEL_ID } from '@/components/levjob-driver/config';

/**
 * レバジョブ（ドライバー）の1画面LP（/levjob-popup）。
 * 背景は /levjob-select のFV画像、その上に「あなたの今のお気持ちは？」のポップアップ。どちらを押してもA8リンクへ。
 * Meta Pixel は /levjob-select・/levjob-driver と同じ 1186966720393058。
 */
const AFFILIATE_URL = 'https://px.a8.net/svt/ejp?a8mat=4B1HTK+EPVUPU+2JK4+5SLUXU';

export const metadata: Metadata = {
  title: 'ドライバー転職ナビ | 高収入・未経験歓迎の求人を無料確認',
  description: 'トラックドライバーの転職を考えている方へ。今のお気持ちを選んで、レバジョブで求人を無料で確認できます。',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <SingleMetaPixel id={LEVJOB_DRIVER_PIXEL_ID} />
      <PopupLp
        prLabel="【PR】レバジョブ"
        // 画像は文字入りなので切らずに横幅いっぱいで上に置き、下は画像の青で埋める
        background={{ src: '/images/levjob-select/fv.webp', position: 'center top', size: '100% auto', color: '#1d4ed8' }}
        lead="＼ トラックドライバーの求人をチェック ／"
        question="あなたの今のお気持ちは？"
        choices={[
          { label: '今すぐ転職したい', color: '#1d4ed8', shadow: '#173d9e' },
          { label: 'まずは情報収集したい', color: '#0ea5e9', shadow: '#0b7fb3' },
        ]}
        affiliateUrl={AFFILIATE_URL}
        theme={{ card: '#eef4ff', accent: '#1d4ed8' }}
        note="本ページはアフィリエイト広告です。紹介サービス：レバジョブ（運営：レバレジーズ株式会社）"
      />
    </>
  );
}
