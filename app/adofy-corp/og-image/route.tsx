import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// ビルド時に1回だけ生成する（ロゴ画像はビルド時に public から読み込む）
export const dynamic = "force-static";

/**
 * コーポレートサイトのOGP画像をコードで生成する（公開URLは /og.png。next.config.ts の rewrite で割り当て）。
 * opengraph-image 規約だと /adofy-corp/opengraph-image という内部URLが出力され、
 * /adofy-corp/* → /* の301転送で404になるため、ルートハンドラーで配信している。
 * 日本語フォントを外部取得しないよう、描画は英字と図形のみに限定している。
 */
const size = { width: 1200, height: 630 };

export async function GET() {
  const logo = `data:image/png;base64,${(await readFile(join(process.cwd(), "public/images/adofy/logo.png"))).toString("base64")}`;
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
          background: "linear-gradient(135deg, #ffffff 0%, #f2f7ff 55%, #e3edff 100%)",
          color: "#172033",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={logo} width={560} height={137} style={{ marginBottom: 8 }} />

        <div style={{ fontSize: 34, fontWeight: 600, color: "#5b6475", marginTop: 30 }}>
          Web advertising, landing pages and websites
        </div>

        <div
          style={{
            fontSize: 23,
            color: "#00b4d0",
            marginTop: 22,
            letterSpacing: "0.16em",
            fontWeight: 700,
          }}
        >
          STRATEGY / CREATIVE / OPTIMIZATION
        </div>
      </div>
    ),
    size
  );
}
