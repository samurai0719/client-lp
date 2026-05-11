import type { Metadata } from 'next';
import DriverContent from '@/components/driver/DriverContent';

// ─────────────────────────────────────────────────────────────────────────────
// A8アフィリエイトリンク管理
// 遷移先URLはここで一元管理しています。変更する場合はこの定数を書き換えてください。
// ─────────────────────────────────────────────────────────────────────────────
const AFFILIATE_URL = 'https://px.a8.net/svt/ejp?a8mat=4B1HTK+EPVUPU+2JK4+5SEKLE';

export const metadata: Metadata = {
  title: 'ドライバー転職ナビ | 高収入・未経験歓迎の求人を無料確認',
  description:
    '未経験から始められるトラックドライバー転職。高収入求人あり・資格取得支援あり。簡単な質問に答えて、あなたに合う求人情報を今すぐ確認しましょう。',
};

export default function Page() {
  return <DriverContent affiliateUrl={AFFILIATE_URL} />;
}
