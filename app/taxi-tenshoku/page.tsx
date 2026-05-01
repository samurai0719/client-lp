import type { Metadata } from 'next';
import TaxiTenshokuContent from './TaxiTenshokuContent';

export const metadata: Metadata = {
  title: '東京・神奈川・千葉・埼玉・大阪で働ける方へ | レバジョブ',
  description:
    '未経験からタクシードライバーで月収50万円を目指せる求人も。普通免許から応募可能、二種免許取得サポートあり。月13回前後の出勤も可能。レバジョブで求人を無料確認。',
};

export default function Page() {
  return <TaxiTenshokuContent />;
}
