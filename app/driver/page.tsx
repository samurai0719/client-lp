import type { Metadata } from 'next';
import DriverContent from '@/components/driver/DriverContent';

const SITE_NAME = 'ドラテク';
const SITE_URL = 'https://driver.taxidriver-beginner.com/';
const TITLE = 'ドラテク | ドライバー求人・転職サービス｜無料登録で求人をご案内';
const DESCRIPTION =
  '未経験から始められるトラックドライバーのお仕事探しは「ドラテク」。高収入求人あり・資格取得支援あり。かんたんな質問に答えて無料登録すると、あなたに合う求人をドラテクがご案内します。';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

/** 構造化データ: ドラテクを運営主体として明示します */
const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      description: 'トラックドライバーの求人紹介・転職支援サービス「ドラテク」。',
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}#website`,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: 'ja',
      publisher: { '@id': `${SITE_URL}#organization` },
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <DriverContent />
    </>
  );
}
