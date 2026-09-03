import { ImageResponse } from "next/og";

/**
 * コーポレートサイトのOGP画像をコードで生成する。
 * 日本語フォントを外部取得しないよう、描画は英字と図形のみに限定している。
 */
export const alt = "adofy — Web advertising and website production";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
        <div
          style={{
            display: "flex",
            width: 88,
            height: 8,
            background: "#2563eb",
            marginBottom: 44,
          }}
        />

        <div style={{ fontSize: 124, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>
          adofy
        </div>

        <div style={{ fontSize: 34, fontWeight: 600, color: "#5b6475", marginTop: 30 }}>
          Web advertising, landing pages and websites
        </div>

        <div
          style={{
            fontSize: 23,
            color: "#2563eb",
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
