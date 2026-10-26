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

// ─────────────────────────────────────────────────────────────────────────────
// 採用レスキュー（adofy の採用支援サービス）
//   saiyo.adofy-site.com
//     /                → /saiyo-rescue            （LP。proxy.ts で書き換え）
//     /thanks          → /saiyo-rescue/thanks     （送信完了）
//     /contact         → /#contact へリダイレクト （フォームはLP内）
//     /admin           → /adofy-admin/saiyo-rescue（管理画面。adofy管理者のみ）
// ─────────────────────────────────────────────────────────────────────────────
const saiyoHosts = ["saiyo.adofy-site.com"];

// ─────────────────────────────────────────────────────────────────────────────
// ドラテク 企業向けLP（adofy ドメイン）
//   doratech.adofy-site.com
//     /                → /driver/company           （LP。proxy.ts で書き換え）
//     /register など   → /driver/company/register  （求人登録・認証・規約）
//     /admin           → /adofy-admin/doratech     （管理画面。adofy管理者のみ）
//   driver.taxidriver-beginner.com/company でも同じLPが開ける。
// ─────────────────────────────────────────────────────────────────────────────
const doratechHosts = ["doratech.adofy-site.com"];

// ドライバー採用サービス 候補者プロフィール検索（scout.adofy-site.com）
//   /            → /driver/scout              （LP。proxy.ts で書き換え）
//   /profiles    → /driver/scout/profiles     （匿名プロフィール一覧）
//   /register    → /driver/scout/register     （無料登録）
//   /requests/:token → /driver/scout/requests/:token（企業向けの面接希望の受付状況）
//   /robots.txt  → /driver/scout/robots.txt
//   /sitemap.xml → /driver/scout/sitemap.xml
// scout.localhost はローカル確認用（http://scout.localhost:3123/ で本番と同じURLの形で開ける）
const scoutHosts = ["scout.adofy-site.com", "scout.localhost"];
const doratechSubpages = ["register", "verify", "terms", "refund-policy", "privacy"];

// コーポレートサイトのサブページ（public: 公開URL / internal: appルート）
const adofyPaths = [
  { public: "profile", internal: "adofy-corp/profile" },
  { public: "works", internal: "adofy-corp/works" },
];

const nextConfig: NextConfig = {
  /*
    public/ をサーバー関数のバンドルから除外する。

    一部のページがビルド時に fs で public/ を読んでいるため
    （lib/nurse-ranking/publicImage.ts・lib/gaikoReview/gallery.ts）、
    Next のファイルトレースが public 全体（264MB）を関数へ取り込み、
    Vercel の 250MB 上限を超えてデプロイが失敗していた。

    該当ページはいずれも静的プリレンダリング（○）で、fs の実行は
    ビルド時のみ。実行時に public/ を読む必要はなく、静的アセットは
    CDN から配信されるため除外して問題ない。
  */
  outputFileTracingExcludes: {
    "**/*": ["./public/**"],
  },
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
      // adofyドメインからは高長建設の管理画面(/admin)へ一切入れない。
      // /admin 配下すべてを adofy専用画面へ振り替える。
      ...adofyHosts.flatMap((host) => [
        {
          source: "/admin/login",
          has: [{ type: "host" as const, value: host }],
          destination: "/adofy-admin/login",
          statusCode: 307 as const,
        },
        {
          source: "/admin",
          has: [{ type: "host" as const, value: host }],
          destination: "/adofy-admin",
          statusCode: 307 as const,
        },
        {
          source: "/admin/:rest*",
          has: [{ type: "host" as const, value: host }],
          destination: "/adofy-admin",
          statusCode: 307 as const,
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
      // ドラテク 営業メール管理: /admin/outreach/* → /adofy-admin/outreach/*
      // /admin は高長建設の管理画面（提携業者もログインする）なので、物理ルートは adofy 管理画面側に置き、
      // adofy 管理者だけが開けるようにしている。redirects は proxy.ts より先に評価されるため、
      // 高長建設のログイン画面へ飛ばされることはない。
      { source: "/admin/outreach", destination: "/adofy-admin/outreach", statusCode: 307 as const },
      { source: "/admin/outreach/:path*", destination: "/adofy-admin/outreach/:path*", statusCode: 307 as const },
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
      // 採用レスキュー
      ...saiyoHosts.flatMap((host) => [
        { source: "/contact", has: [{ type: "host" as const, value: host }], destination: "/#contact", statusCode: 302 as const },
        { source: "/admin", has: [{ type: "host" as const, value: host }], destination: "/adofy-admin/saiyo-rescue", statusCode: 307 as const },
        { source: "/admin/leads", has: [{ type: "host" as const, value: host }], destination: "/adofy-admin/saiyo-rescue/leads", statusCode: 307 as const },
        { source: "/admin/leads/:id", has: [{ type: "host" as const, value: host }], destination: "/adofy-admin/saiyo-rescue/leads/:id", statusCode: 307 as const },
        // 内部パスへの直アクセスは公開URLへ寄せる
        { source: "/saiyo-rescue", has: [{ type: "host" as const, value: host }], destination: "/", statusCode: 301 as const },
        { source: "/saiyo-rescue/thanks", has: [{ type: "host" as const, value: host }], destination: "/thanks", statusCode: 301 as const },
      ]),
      // 候補者プロフィール検索LP：内部パスへの直アクセスは公開URLへ寄せる（重複URLを作らない）
      ...scoutHosts.flatMap((host) => [
        { source: "/driver/scout", has: [{ type: "host" as const, value: host }], destination: "/", statusCode: 301 as const },
        { source: "/driver/scout/profiles", has: [{ type: "host" as const, value: host }], destination: "/profiles", statusCode: 301 as const },
        { source: "/driver/scout/register", has: [{ type: "host" as const, value: host }], destination: "/register", statusCode: 301 as const },
      ]),
      // ドラテク 企業向け（doratech.adofy-site.com）
      ...doratechHosts.flatMap((host) => [
        { source: "/admin", has: [{ type: "host" as const, value: host }], destination: "/adofy-admin/doratech", statusCode: 307 as const },
        { source: "/admin/:id", has: [{ type: "host" as const, value: host }], destination: "/adofy-admin/doratech/:id", statusCode: 307 as const },
        // 内部パスへの直アクセスは公開URLへ寄せる
        { source: "/driver/company", has: [{ type: "host" as const, value: host }], destination: "/", statusCode: 301 as const },
      ]),
      // adofy-site.com/saiyo-rescue で開かれた場合も専用ドメインへ
      ...adofyHosts.map((host) => ({
        source: "/saiyo-rescue",
        has: [{ type: "host" as const, value: host }],
        destination: "https://saiyo.adofy-site.com/",
        statusCode: 301 as const,
      })),
      // ドラテク: 内部ルートへの直アクセスは公開URLへ寄せる（重複URLを作らない）。
      // リダイレクトは rewrite より先に評価されるため、
      // /company → /driver/company の rewrite とループしない。
      {
        source: "/driver/company",
        has: [{ type: "host" as const, value: "driver.taxidriver-beginner.com" }],
        destination: "/company",
        statusCode: 301,
      },
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
        // ── driver.taxidriver-beginner.com（ドラテク） ─────────────────
        //   /        = 求職者向けLP        → /driver
        //   /company = 企業向け（採用担当者向け）LP → /driver/company
        //
        // ルート直下の /company は adofy コーポレートサイトが既に使っているため、
        // 企業向けLPの物理ルートは /driver/company に置き、このホストのときだけ
        // 公開URLを /company に合わせている（takanaga / adofy と同じやり方）。
        {
          source: "/",
          has: [{ type: "host", value: "driver.taxidriver-beginner.com" }],
          destination: "/driver",
        },
        {
          source: "/company",
          has: [{ type: "host", value: "driver.taxidriver-beginner.com" }],
          destination: "/driver/company",
        },

        // ── saiyo.adofy-site.com（採用レスキュー） ─────────────────────
        // ルート(/)は proxy.ts で処理する
        ...saiyoHosts.map((host) => ({
          source: "/thanks",
          has: [{ type: "host" as const, value: host }],
          destination: "/saiyo-rescue/thanks",
        })),

        // ── scout.adofy-site.com（候補者プロフィール検索LP） ─────────────
        ...scoutHosts.flatMap((host) => [
          { source: "/robots.txt", has: [{ type: "host" as const, value: host }], destination: "/driver/scout/robots.txt" },
          { source: "/sitemap.xml", has: [{ type: "host" as const, value: host }], destination: "/driver/scout/sitemap.xml" },
          { source: "/profiles", has: [{ type: "host" as const, value: host }], destination: "/driver/scout/profiles" },
          { source: "/register", has: [{ type: "host" as const, value: host }], destination: "/driver/scout/register" },
          { source: "/requests/:token", has: [{ type: "host" as const, value: host }], destination: "/driver/scout/requests/:token" },
        ]),

        // ── doratech.adofy-site.com（ドラテク 企業向け） ────────────────
        // ルート(/)は proxy.ts で処理する
        ...doratechHosts.flatMap((host) =>
          doratechSubpages.map((page) => ({
            source: `/${page}`,
            has: [{ type: "host" as const, value: host }],
            destination: `/driver/company/${page}`,
          }))
        ),

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

        // adofy-site.com の sitemap.xml / robots.txt
        ...adofyHosts.flatMap((host) => [
          {
            source: "/sitemap.xml",
            has: [{ type: "host" as const, value: host }],
            destination: "/adofy-corp/sitemap.xml",
          },
          {
            source: "/robots.txt",
            has: [{ type: "host" as const, value: host }],
            destination: "/adofy-corp/robots.txt",
          },
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
