import type { Metadata } from 'next';
import RizapGolfContent from './RizapGolfContent';

export const metadata: Metadata = {
  title: 'RIZAP GOLF｜体験レッスン付きゴルフ力診断',
  description:
    'ドライバーのスライスや自己流練習の限界に悩む方へ。RIZAP GOLFの体験レッスン付きゴルフ力診断で、自分の課題を確認できます。',
};

export default function Page() {
  return <RizapGolfContent />;
}
