/**
 * adofy の事業内容と会社概要（コーポレートサイト /business、ドラテクLPの運営会社欄で共有）。
 * 所在地の番地・電話番号など、確認できていない情報は書かない。
 */
export const COMPANY = {
  name: "adofy（アドフィー）",
  representative: "塚本 隼平",
  area: "岐阜県（全国対応）",
  url: "https://adofy-site.com",
  businessUrl: "https://adofy-site.com/business",
  profileUrl: "https://adofy-site.com/profile",
  articlesUrl: "https://adofy-site.com/articles",
  contactUrl: "https://adofy-site.com/contact",
} as const;

export type Business = {
  title: string;
  category: "マーケティング" | "採用支援" | "自社サービス";
  body: string;
  link?: { href: string; label: string };
};

export const BUSINESSES: Business[] = [
  {
    title: "Web広告運用（成果報酬型を含む）",
    category: "マーケティング",
    body: "Meta広告を中心に、訴求・クリエイティブ・LPまで改善しながら運用します。看護師・薬剤師・ドライバー・施工管理など、人材領域の広告運用に取り組んできました。",
  },
  {
    title: "LP・ホームページ制作",
    category: "マーケティング",
    body: "広告から問い合わせ・応募までの導線を設計したLPと、会社の信頼感を伝えるホームページを制作します。",
  },
  {
    title: "広告クリエイティブ制作",
    category: "マーケティング",
    body: "バナー・動画広告・SNS画像など、見る人の行動につながるクリエイティブを企画・制作します。",
  },
  {
    title: "採用支援「採用レスキュー」",
    category: "採用支援",
    body: "採用LPと広告クリエイティブをセットで制作し、求人の応募が集まる導線を設計します。",
    link: { href: "https://saiyo.adofy-site.com/", label: "採用レスキューを見る" },
  },
  {
    title: "ドライバー採用サービス「ドラテク」",
    category: "自社サービス",
    body: "愛知県の運送会社様向け。ドライバー求職者の情報を見て面接したい人を選ぶと、求職者への連絡と面接の日程調整をドラテクが行います。",
    link: { href: "https://scout.adofy-site.com/", label: "ドラテク（企業向け）を見る" },
  },
  {
    title: "ドライバー転職支援「ドラテク」",
    category: "自社サービス",
    body: "トラックドライバーを目指す方・転職を考える方に向けて、仕事探しを支援するサービスです。",
    link: { href: "https://driver.taxidriver-beginner.com/", label: "ドラテク（求職者向け）を見る" },
  },
];
