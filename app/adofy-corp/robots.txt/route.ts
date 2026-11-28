// www.adofy-site.com 用の robots.txt。
// robots.ts の規約は app 直下でしか効かない（複数ドメイン同居のため置けない）ので、
// ルートハンドラーで配信し、next.config.ts のホスト条件付き rewrite で /robots.txt をここへ割り当てる。
import { CORP_SITE } from "@/components/adofy-corp/seo";

export function GET() {
  const body = [
    "User-Agent: *",
    "Allow: /",
    // 管理画面と内部ルートは検索結果に出さない
    "Disallow: /admin",
    "Disallow: /adofy-admin",
    "Disallow: /api/",
    "Disallow: /adofy-corp",
    "Disallow: /contact/thanks",
    "",
    `Sitemap: ${CORP_SITE.url}/sitemap.xml`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
