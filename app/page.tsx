import type { Metadata } from 'next';
import GaihekiArticleLP from './gaiheki-article/GaihekiArticleLP';

export const metadata: Metadata = {
  title: '外壁塗装で失敗しないために知っておきたい7つのポイント | Paint Net',
  description:
    '外壁塗装の費用・塗料の選び方・相見積もりの重要性を分かりやすく解説。東海エリア（岐阜・愛知・三重）で外壁塗装を検討中の方は、まずこの記事をお読みください。',
};

export default function HomePage() {
  return <GaihekiArticleLP />;
}
