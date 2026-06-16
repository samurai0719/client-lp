import type { Metadata } from 'next';
import KiminaraLP from './kiminara/KiminaraLP';

export const metadata: Metadata = {
  title: 'キミナラ | 20代向け転職エージェント紹介サービス',
  description:
    'キミナラは、あなたに合う転職エージェントを紹介する20代向け転職支援サービスです。希望や性格に合うキャリアアドバイザーを紹介します。',
};

export default function HomePage() {
  return <KiminaraLP />;
}
