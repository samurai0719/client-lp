import { Fragment, type ReactNode } from "react";

const EMPHASIS_RED = "#B3261E";
const EMPHASIS_RED_ON_DARK = "#FFD9C9";
const EMPHASIS_UNDERLINE = "#F5E58E";

// 本文中の **強調したい部分** を太字・赤字・マーカー風アンダーラインで表示する簡易マークアップ。
// データファイル側で `**...**` を使うだけで反映される。
// サーバーコンポーネントからも呼び出せるよう、クライアント専用コードを含まないファイルに分離している。
export function withEmphasis(text: ReactNode, light = false): ReactNode {
  if (typeof text !== "string") return text;
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter((part) => part.length > 0);
  if (parts.length === 1 && !parts[0].startsWith("**")) return text;

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong
          key={i}
          className="font-bold"
          style={{
            color: light ? EMPHASIS_RED_ON_DARK : EMPHASIS_RED,
            // text-decoration/underline-offsetはフォント（明朝/ゴシック）ごとに基準位置の
            // メトリクスが異なり、同じ数値でも被り方がバラバラになってしまう。
            // そのためフォントに依存しない背景グラデーションでマーカー風の帯を描画し、
            // 見え方を常に統一する（行の高さに対する割合指定なので文字サイズが変わっても比率は同じ）。
            backgroundImage: `linear-gradient(to top, transparent 0%, transparent 12%, ${EMPHASIS_UNDERLINE} 12%, ${EMPHASIS_UNDERLINE} 38%, transparent 38%, transparent 100%)`,
            boxDecorationBreak: "clone",
            WebkitBoxDecorationBreak: "clone",
          }}
        >
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
