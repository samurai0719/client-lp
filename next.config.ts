import type { NextConfig } from "next";

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
  async rewrites() {
    // ── takanagakensetu.com ルーティング方針 ──────────────────────────────
    //
    // 【現在の構成】
    //   /                    → /gaikou          (外構リフォームLP ※広告配信中)
    //   /lp/gaikou-reform    → app/lp/gaikou-reform/page.tsx (LP正規URL)
    //   /simulation          → app/simulation/page.tsx       (AIシミュレーター)
    //   /services            → /takanaga/services            (会社HP：工事内容)
    //   /works               → /takanaga/works               (会社HP：施工事例)
    //   /company             → /takanaga/company             (会社HP：会社案内)
    //   /area                → /takanaga/area                (会社HP：対応地域)
    //   /faq                 → /takanaga/faq                 (会社HP：よくある質問)
    //   /contact             → /takanaga/contact             (会社HP：お問い合わせ)
    //   /strengths           → /takanaga/strengths
    //   /price               → /takanaga/price
    //   /flow                → /takanaga/flow
    //   /news                → /takanaga/news
    //   /privacy             → /takanaga/privacy
    //
    // 【会社HPをルート(/)に切り替える手順】
    //   広告管理画面でリンク先を takanagakensetu.com/lp/gaikou-reform に変更後:
    //   下記2行の destination を "/gaikou" → "/takanaga" に書き換えてデプロイ
    //   ※ /lp/gaikou-reform は引き続き動作するため LP は消えない
    //
    // 【注意】/lp, /simulation は直接 Next.js ページが存在するため rewrite 不要

    const takanagaHosts = ["takanagakensetu.com", "www.takanagakensetu.com"];

    // 会社HP サブパス（/takanaga/* にリライト）
    // ※ lp / simulation は実ページがあるため含めない
    const hpPaths = [
      "services", "works", "strengths", "price", "flow",
      "company", "area", "faq", "news", "contact", "privacy",
    ];

    const subpathRewrites = takanagaHosts.flatMap((host) => [
      // HP サブページ: takanagakensetu.com/services → /takanaga/services
      ...hpPaths.map((path) => ({
        source: `/${path}/:rest*`,
        has: [{ type: "host" as const, value: host }],
        destination: `/takanaga/${path}/:rest*`,
      })),
      // HP サブページ(直接): takanagakensetu.com/services → /takanaga/services
      ...hpPaths.map((path) => ({
        source: `/${path}`,
        has: [{ type: "host" as const, value: host }],
        destination: `/takanaga/${path}`,
      })),
    ]);

    return {
      beforeFiles: [
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
        // 広告LP (/) は現状維持。広告停止後に /takanaga へ切り替える。
        // 切り替え時: destination を "/gaikou" → "/takanaga" に変更する。
        {
          source: "/",
          has: [{ type: "host", value: "takanagakensetu.com" }],
          destination: "/gaikou",
        },
        {
          source: "/",
          has: [{ type: "host", value: "www.takanagakensetu.com" }],
          destination: "/gaikou",
        },

        // コーポレートHPサブページ（今すぐ有効）
        ...subpathRewrites,
      ],
    };
  },
};

export default nextConfig;
