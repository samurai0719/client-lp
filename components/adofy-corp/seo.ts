import type { Metadata } from "next";

/**
 * adofy コーポレートサイトのSEO設定。
 * 各ページのタイトル・説明文・canonical をここで一元管理する。
 */

export const CORP_SITE = {
  name: "adofy",
  url: "https://adofy-site.com",
  /** 建設業特化LPは別ホストで運用している */
  lpUrl: "https://lp.adofy-site.com",
  locale: "ja_JP",
  area: "岐阜県",
} as const;

type PageSeo = {
  path: string;
  title: string;
  description: string;
  /** sitemap の優先度（0.0〜1.0） */
  priority: number;
};

export const CORP_PAGES: Record<string, PageSeo> = {
  home: {
    path: "/",
    title: "adofy｜岐阜のWeb広告運用・ホームページ制作",
    description:
      "adofyは岐阜を拠点に、Meta広告を中心とした広告運用とLP・ホームページ制作を行うWebマーケティング会社です。看護師・薬剤師・ドライバー・施工管理など複数ジャンルで運用してきた実績をもとに、広告から問い合わせまで一貫して設計します。",
    priority: 1.0,
  },
  profile: {
    path: "/profile",
    title: "運営者プロフィール｜広告運用とLP改善の実績",
    description:
      "adofy代表のプロフィール。広告運用型アフィリエイト事業を中心に、Meta広告の運用、LP改善、クリエイティブ制作を実践。看護師・薬剤師・ドライバー・施工管理・介護・ゴルフなど複数ジャンルで数字を追ってきた経歴をご紹介します。",
    priority: 0.8,
  },
  "works/leverages": {
    path: "/works/leverages",
    title: "レバレジーズ｜広告運用・LP制作の実績",
    description:
      "レバレジーズ様の広告運用・LP制作実績。ターゲット分析からクリエイティブ改善、LP最適化まで一貫して担当した取り組みをご紹介します。",
    priority: 0.7,
  },
  "works/mynavi-pharmacist": {
    path: "/works/mynavi-pharmacist",
    title: "マイナビ薬剤師｜広告運用・診断LP制作の実績",
    description:
      "マイナビ薬剤師様の広告運用・診断LP制作実績。好条件の求人を求職者につなげるため、ターゲット分析・クリエイティブ改善・診断LP最適化を行いました。",
    priority: 0.7,
  },
  "works/nurse-senka": {
    path: "/works/nurse-senka",
    title: "ナース専科｜広告運用・LP制作の実績",
    description:
      "ナース専科様の広告運用・LP制作実績。看護師向けの訴求設計とクリエイティブ改善を通じ、応募につながる導線を設計しました。",
    priority: 0.7,
  },
  "works/rizap-golf": {
    path: "/works/rizap-golf",
    title: "RIZAP GOLF｜広告運用・記事LP制作の実績",
    description:
      "RIZAP GOLF様の広告運用・記事LP制作実績。高単価商材でも予約につながるよう、ターゲット分析・クリエイティブ改善・記事LP最適化を行いました。",
    priority: 0.7,
  },
};

/** 各ページの metadata を組み立てる */
export function corpMetadata(key: keyof typeof CORP_PAGES): Metadata {
  const page = CORP_PAGES[key];
  const url = `${CORP_SITE.url}${page.path}`;

  return {
    metadataBase: new URL(CORP_SITE.url),
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      type: "website",
      locale: CORP_SITE.locale,
      siteName: CORP_SITE.name,
      title: page.title,
      description: page.description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}
