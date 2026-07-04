import { siteConfig } from "@/data/takanaga/siteConfig";

// takanagakensetu.com 用の robots.txt。
// Next.jsの robots.ts 規約は app ルート直下でしか有効にならない
// （このリポジトリは複数ドメイン同居のためルートには置けない）ので、
// ルートハンドラーで配信し、next.config.ts のホスト条件付きrewriteで
// takanagakensetu.com/robots.txt → このルートへ割り当てる。
export function GET() {
  const body = [
    "User-Agent: *",
    "Allow: /",
    // /contact/thanks は完了ページのためクロール不要（CSS/JS/画像はブロックしない）
    "Disallow: /contact/thanks",
    "Disallow: /admin/",
    "Disallow: /api/",
    "",
    `Sitemap: https://${siteConfig.domain}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
