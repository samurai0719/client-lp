import type { Metadata } from 'next';
import SingleMetaPixel from '@/components/analytics/SingleMetaPixel';
import DriverContent from '@/components/levjob-select/DriverContent';
import { LEVJOB_DRIVER_PIXEL_ID } from '@/components/levjob-driver/config';

/**
 * レバジョブ（ドライバー）の選択型LP（/levjob-select）。
 * 2026-09-21 にドラテクへ作り替える前の /driver（commit 33eac1c の1つ前）をそのまま復元したもの。
 * 画像は当時の Wix 配信分をローカルに保存。Meta Pixel は /levjob-driver と同じ 1186966720393058。
 */

// A8アフィリエイトリンク（当時と同じ「転職サイト紹介様＿トラックLP用」）
const AFFILIATE_URL = 'https://px.a8.net/svt/ejp?a8mat=4B1HTK+EPVUPU+2JK4+5SLUXU';

export const metadata: Metadata = {
  title: 'ドライバー転職ナビ | 高収入・未経験歓迎の求人を無料確認',
  description:
    '未経験から始められるトラックドライバー転職。高収入求人あり・資格取得支援あり。簡単な質問に答えて、あなたに合う求人情報を今すぐ確認しましょう。',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <SingleMetaPixel id={LEVJOB_DRIVER_PIXEL_ID} />
      <DriverContent affiliateUrl={AFFILIATE_URL} />
    </>
  );
}
