import type { Metadata } from 'next';
import GaihekiLP from './GaihekiLP';

export const metadata: Metadata = {
  title: '外壁塗装 無料診断 | 岐阜・愛知・三重の外壁塗装相場と業者選び',
  description:
    '30秒の7問診断で、あなたのお家に最適な外壁塗装の進め方が分かります。相場・塗装時期・おすすめ塗料・地域対応会社を無料でご確認いただけます。',
};

export default function GaihekiPage() {
  return <GaihekiLP />;
}
