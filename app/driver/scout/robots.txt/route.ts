import { SITE_URL } from "@/components/driver-scout/seo";

// scout.adofy-site.com 用の robots.txt。
// robots.ts の規約は app 直下でしか効かない（このリポジトリは複数ドメイン同居のため置けない）ので、
// ルートハンドラーで配信し、next.config.ts のホスト条件付き rewrite で /robots.txt をここへ割り当てる。
export function GET() {
  const body = ["User-Agent: *", "Allow: /", "Disallow: /api/", "Disallow: /adofy-admin/", "", `Sitemap: ${SITE_URL}/sitemap.xml`, ""].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
