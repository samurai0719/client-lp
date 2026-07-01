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
          className="font-bold underline"
          style={{
            color: light ? EMPHASIS_RED_ON_DARK : EMPHASIS_RED,
            textDecorationColor: EMPHASIS_UNDERLINE,
            // フォントサイズが変わっても比率が崩れないよう em単位で統一する
            // （ファーストビュー直下のセクション＝16〜17px時の 4px / -4px と同じ見え方になるよう調整）
            textDecorationThickness: "0.24em",
            textUnderlineOffset: "-0.22em",
          }}
        >
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
