import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
          has: [{ type: "host", value: "taxidriver-beginner.com" }],
          destination: "/taxi-tenshoku",
        },
        {
          source: "/",
          has: [{ type: "host", value: "www.taxidriver-beginner.com" }],
          destination: "/taxi-tenshoku",
        },
      ],
    };
  },
};

export default nextConfig;
