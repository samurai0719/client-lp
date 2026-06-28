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
    // takanagakensetu.com のルーティング方針:
    //   現在: / → /gaikou (広告LP。広告停止後に下記のコメントアウトを切り替える)
    //   将来: / → /takanaga (コーポレートHP)
    // コーポレートHPサブページ (/services, /works 等) は今すぐ有効。
    // LP は引き続き /gaikou で直接アクセス可能。

    const takanagaHosts = ["takanagakensetu.com", "www.takanagakensetu.com"];

    // コーポレートHPのサブパス一覧
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
