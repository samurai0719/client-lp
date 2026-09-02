import type { NextConfig } from "next";

// takanagakensetu.com 用のホスト条件とコーポレートHPサブパス一覧
// （このリポジトリは他社LPも同居しているため、物理ルートは動かさず
//   ホスト条件付きの rewrite / redirect で takanagakensetu.com のURL構成を制御する）
const takanagaHosts = ["takanagakensetu.com", "www.takanagakensetu.com"];
// public: 公開URL（takanagakensetu.com直下）/ internal: appルート（/takanaga配下）
// 料金ページのみ公開URLを /pricing に変更（内部ルートは /takanaga/price のまま）
const takanagaHpPaths = [
  { public: "services", internal: "services" },
  { public: "works", internal: "works" },
  { public: "strengths", internal: "strengths" },
  { public: "pricing", internal: "price" },
  { public: "flow", internal: "flow" },
  { public: "company", internal: "company" },
  { public: "area", internal: "area" },
  { public: "faq", internal: "faq" },
  { public: "news", internal: "news" },
  { public: "contact", internal: "contact" },
  { public: "privacy", internal: "privacy" },
  { public: "simulation", internal: "simulation" },
];

// ─────────────────────────────────────────────────────────────────────────────
// adofy のURL構成（2サイトをホストで分ける）
//
//   adofy-site.com            = コーポレートサイト（メイン）
//     /            → /adofy-corp
//     /profile     → /adofy-corp/profile
//     /works/xxx   → /adofy-corp/works/xxx
//     /contact     → そのまま（無料相談フォーム）
//
//   lp.adofy-site.com         = 建設業特化の集客LP（広告の着地先）
//     /            → /adofy
//     /contact     → そのまま（無料相談フォーム）
//
// ※ 各ホストのルート(/)の書き換えは proxy.ts で処理する
//    （takanagaと同じ理由。beforeFiles に置くとマッチ後も評価が続き連鎖するため）
const adofyHosts = ["adofy-site.com", "www.adofy-site.com"];
const adofyLpHosts = ["lp.adofy-site.com"];

// コーポレートサイトのサブページ（public: 公開URL / internal: appルート）
const adofyPaths = [
  { public: "profile", internal: "adofy-corp/profile" },
  { public: "works", internal: "adofy-corp/works" },
];

const nextConfig: NextConfig = {
  experimental: {
    // iCloud同期(Desktop & Documents)が .next/dev/cache/turbopack の永続キャッシュファイルと
    // 競合し、開発サーバーがクラッシュする問題を避けるため無効化
    turbopackFileSystemCacheForDev: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
        pathname: "/media/**",
      },
    ],
  },
  async redirects() {
    // 旧URL → 新URL の301リダイレクト（takanagakensetu.com のみ）
    // 注意: / と /takanaga の間には絶対にリダイレクトを張らない（両方200で配信する）
    const subpathRedirects = takanagaHosts.flatMap((host) =>
      takanagaHpPaths.flatMap(({ public: pub, internal }) => [
        // 動的ページ含む: /takanaga/works/xxx → /works/xxx
        {
          source: `/takanaga/${internal}/:rest*`,
          has: [{ type: "host" as const, value: host }],
          destination: `/${pub}/:rest*`,
          statusCode: 301,
        },
        // 直接: /takanaga/services → /services
        {
          source: `/takanaga/${internal}`,
          has: [{ type: "host" as const, value: host }],
          destination: `/${pub}`,
          statusCode: 301,
        },
      ])
    );

    // 内部ルートへの直アクセスは公開URLへ寄せる（重複URLを作らない）
    const adofyRedirects = [
      // コーポレート側
      ...adofyHosts.flatMap((host) => [
        {
          source: "/adofy-corp",
          has: [{ type: "host" as const, value: host }],
          destination: "/",
          statusCode: 301,
        },
        {
          source: "/adofy-corp/:rest*",
          has: [{ type: "host" as const, value: host }],
          destination: "/:rest*",
          statusCode: 301,
        },
        // LPはサブドメインへ移したため、旧URL(/lp)を救済する
        {
          source: "/lp",
          has: [{ type: "host" as const, value: host }],
          destination: "https://lp.adofy-site.com/",
          statusCode: 301,
        },
        {
          source: "/adofy",
          has: [{ type: "host" as const, value: host }],
          destination: "https://lp.adofy-site.com/",
          statusCode: 301,
        },
      ]),
      // LP側
      ...adofyLpHosts.flatMap((host) => [
        {
          source: "/adofy",
          has: [{ type: "host" as const, value: host }],
          destination: "/",
          statusCode: 301,
        },
      ]),
    ];

    // 旧公開URL /price → 新公開URL /pricing（2026-07-04まで公開していたURL）
    const priceRedirects = takanagaHosts.flatMap((host) => [
      {
        source: "/price/:rest*",
        has: [{ type: "host" as const, value: host }],
        destination: "/pricing/:rest*",
        statusCode: 301,
      },
      {
        source: "/price",
        has: [{ type: "host" as const, value: host }],
        destination: "/pricing",
        statusCode: 301,
      },
    ]);

    return [
      // URL正規化: wwwなし → wwwあり（https化はVercelが自動処理）
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: "takanagakensetu.com" }],
        destination: "https://www.takanagakensetu.com/:path*",
        statusCode: 301,
      },
      // 旧LP URL → 新LP URL（/gaikou配下の診断・サンクスはそのまま）
      ...takanagaHosts.map((host) => ({
        source: "/gaikou",
        has: [{ type: "host" as const, value: host }],
        destination: "/takanaga",
        statusCode: 301,
      })),
      ...priceRedirects,
      ...subpathRedirects,
          ...adofyRedirects,
];
  },
  async rewrites() {
    // takanagakensetu.com のルーティング（2026-07-04 切替済み）:
    //   / → /takanaga (コーポレートHP)
    //   /takanaga → /gaikou (外構広告LP)
    //   /services 等 → /takanaga/services 等 (HPサブページ)

    const subpathRewrites = takanagaHosts.flatMap((host) => [
      // HP サブページ: takanagakensetu.com/services → /takanaga/services
      ...takanagaHpPaths.map(({ public: pub, internal }) => ({
        source: `/${pub}/:rest*`,
        has: [{ type: "host" as const, value: host }],
        destination: `/takanaga/${internal}/:rest*`,
      })),
      // HP サブページ(直接): takanagakensetu.com/services → /takanaga/services
      ...takanagaHpPaths.map(({ public: pub, internal }) => ({
        source: `/${pub}`,
        has: [{ type: "host" as const, value: host }],
        destination: `/takanaga/${internal}`,
      })),
    ]);

    return {
      beforeFiles: [
        // 施工管理LP（レバジョブ）: public/sekou-kanri/index.html を静的配信する。
        // Next.jsのルート(app/sekou-kanri)は廃止し、納品HTMLをそのまま配信している。
        // /sekou-kanri/ は Next.js が /sekou-kanri へ308正規化するため、両方同じページになる。
        {
          source: "/sekou-kanri",
          destination: "/sekou-kanri/index.html",
        },
        {
          source: "/",
          has: [{ type: "host", value: "golfprayer-joutatu.com" }],
          destination: "/rizap-golf",
        },
        {
          source: "/",
          has: [{ type: "host", value: "www.golfprayer-joutatu.com" }],
          destination: "/rizap-golf",
        },
        {
          source: "/",
          has: [{ type: "host", value: "driver.taxidriver-beginner.com" }],
          destination: "/driver",
        },

        // ── takanagakensetu.com ────────────────────────────────────────
        // 「/ → コーポレートHP」「/takanaga → 外構LP」の2つの書き換えは
        // proxy.ts（ミドルウェア）で処理している。
        // beforeFilesに置くとマッチ後も評価が続き「/ → /takanaga → /gaikou」と
        // 連鎖してルートがLPになる不具合があるため、ここには置かないこと。

        // コーポレートHPサブページ
        ...subpathRewrites,

        // ── adofy-site.com（コーポレート） ──────────────────────────────
        // ルート(/)は proxy.ts で処理する。ここではサブパスのみ扱う。
        ...adofyHosts.flatMap((host) => [
          ...adofyPaths.map(({ public: pub, internal }) => ({
            source: `/${pub}/:rest*`,
            has: [{ type: "host" as const, value: host }],
            destination: `/${internal}/:rest*`,
          })),
          ...adofyPaths.map(({ public: pub, internal }) => ({
            source: `/${pub}`,
            has: [{ type: "host" as const, value: host }],
            destination: `/${internal}`,
          })),
        ]),

        // sitemap.xml / robots.txt を takanaga 用にプロキシ
        {
          source: "/sitemap.xml",
          has: [{ type: "host", value: "takanagakensetu.com" }],
          destination: "/takanaga/sitemap.xml",
        },
        {
          source: "/sitemap.xml",
          has: [{ type: "host", value: "www.takanagakensetu.com" }],
          destination: "/takanaga/sitemap.xml",
        },
        {
          source: "/robots.txt",
          has: [{ type: "host", value: "takanagakensetu.com" }],
          destination: "/takanaga/robots.txt",
        },
        {
          source: "/robots.txt",
          has: [{ type: "host", value: "www.takanagakensetu.com" }],
          destination: "/takanaga/robots.txt",
        },
      ],
    };
  },
};

export default nextConfig;
