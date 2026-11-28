import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * OGP画像をコードで生成する（画像ファイルを追加せずにOGPを成立させる）。
 * 日本語フォントを外部取得しないよう、描画するのは英字と図形のみに限定している。
 */
export const alt = "adofy — websites that bring inquiries to construction businesses";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  // ロゴ（白抜き）はビルド時に public から読み込む
  const logo = `data:image/png;base64,${(await readFile(join(process.cwd(), "public/images/adofy/logo-white.png"))).toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 88px",
          background: "linear-gradient(135deg, #04101f 0%, #0b2440 60%, #123457 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* アクセントバー */}
        <div
          style={{
            display: "flex",
            width: 96,
            height: 8,
            background: "#f26a1b",
            marginBottom: 44,
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={logo} width={560} height={137} style={{ marginBottom: 8 }} />

        <div
          style={{
            fontSize: 34,
            fontWeight: 600,
            color: "#a9bdd4",
            marginTop: 30,
            letterSpacing: "0.01em",
          }}
        >
          Websites built to win work for construction businesses
        </div>

        <div
          style={{
            fontSize: 24,
            color: "#f26a1b",
            marginTop: 22,
            letterSpacing: "0.16em",
            fontWeight: 700,
          }}
        >
          STRATEGY / DESIGN / LEAD GENERATION
        </div>
      </div>
    ),
    size
  );
}
