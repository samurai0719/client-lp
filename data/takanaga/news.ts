// ─────────────────────────────────────────────────────────────────────────────
// お知らせ・コラムデータ
// ─────────────────────────────────────────────────────────────────────────────

export type NewsCategory = "お知らせ" | "施工コラム" | "季節のメンテナンス";

export type NewsItem = {
  slug: string;
  title: string;
  category: NewsCategory;
  publishedAt: string; // ISO 8601
  excerpt: string;
  body: string;
  thumbnail?: string;
  published: boolean;
};

export const news: NewsItem[] = [
  // 実際の記事が用意でき次第、ここに追加してください。
  // 例:
  // {
  //   slug: "2025-summer-maintenance",
  //   title: "夏前に確認したい！外構まわりのメンテナンスポイント",
  //   category: "季節のメンテナンス",
  //   publishedAt: "2025-06-01",
  //   excerpt: "...",
  //   body: "...",
  //   published: true,
  // },
];

export const publishedNews = news.filter((n) => n.published);
