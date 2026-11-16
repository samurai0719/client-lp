import type { CSSProperties } from "react";

/**
 * 見出し（h1〜h4）の文字をインラインSVGで描く部品。週休3日LP（/nurse-shukyu3）で使う。
 *
 * ・読み上げ・検索用に、同じ文言を sr-only のテキストで見出しタグの中に持つ（SVG は aria-hidden）。
 * ・SVG の文字は折り返さないので、行は lines で明示する。幅は文字数から見積もり、
 *   画面が狭いときは max-width:100% で全体を縮める（文字が欠けない）。
 * ・グラデーションは <SvgHeadingDefs /> をページに1回置いて共有する（Server/Client どちらでも使える）。
 * ・強調したい語は highlight に渡すと、ピンクのグラデーションで描く。
 */

const FONT = "'Hiragino Sans','Hiragino Kaku Gothic ProN','Noto Sans JP','Yu Gothic',sans-serif";

/** 1文字の幅（em）の見積もり：全角=1、半角英数=0.62、記号の一部=0.4 */
function emWidth(text: string): number {
  let w = 0;
  for (const ch of text) {
    if (/[!！、。・,.]/.test(ch)) w += ch === "!" || ch === "," || ch === "." ? 0.4 : 1;
    else if (/[\x20-\x7e]/.test(ch)) w += 0.62;
    else w += 1;
  }
  return w;
}

type Variant = "section" | "ribbon" | "sub" | "plain";

const STYLE: Record<Variant, { fill: string; stroke: string; strokeWidth: number; weight: number }> = {
  // セクション見出し：紺の文字＋白フチ、強調語はピンク
  section: { fill: "#1f2a44", stroke: "#ffffff", strokeWidth: 5, weight: 900 },
  // 金・銀・銅のリボンの上：白い文字＋うっすら影のフチ
  ribbon: { fill: "#ffffff", stroke: "rgba(80,40,0,0.35)", strokeWidth: 3, weight: 900 },
  // カード内の小見出し：ピンクの文字
  sub: { fill: "url(#sh-pink)", stroke: "#ffffff", strokeWidth: 3, weight: 900 },
  // 装飾なし（枠の中など）
  plain: { fill: "#1f2a44", stroke: "#ffffff", strokeWidth: 4, weight: 900 },
};

/** ページに1回だけ置く共有のグラデーション定義 */
export function SvgHeadingDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="sh-pink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff6fa5" />
          <stop offset="1" stopColor="#d6286a" />
        </linearGradient>
        <linearGradient id="sh-marker" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffe066" />
          <stop offset="1" stopColor="#ffbe2e" />
        </linearGradient>
        <linearGradient id="sh-bar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ff8ab6" />
          <stop offset=".5" stopColor="#e8437a" />
          <stop offset="1" stopColor="#ff8ab6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** 1行の中の強調語を分けて tspan にする */
function segments(line: string, highlight?: string[]) {
  if (!highlight?.length) return [{ t: line, hi: false }];
  const re = new RegExp(`(${highlight.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  return line.split(re).filter(Boolean).map((t) => ({ t, hi: highlight.includes(t) }));
}

export default function SvgHeading({
  as: Tag = "h2",
  id,
  lines,
  size = 22,
  align = "center",
  variant = "section",
  highlight,
  underline = variant === "section",
  className = "",
  style,
}: {
  as?: "h1" | "h2" | "h3" | "h4";
  id?: string;
  lines: string[];
  /** 1行の文字サイズ（px）。画面が狭いときは全体が縮む */
  size?: number;
  align?: "center" | "left";
  variant?: Variant;
  /** ピンクで強調する語 */
  highlight?: string[];
  /** 下に飾りの下線を引く（セクション見出しの既定） */
  underline?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const st = STYLE[variant];
  const lineH = size * 1.32;
  const pad = st.strokeWidth + 2;
  const maxEm = Math.max(...lines.map(emWidth));
  const width = Math.ceil(maxEm * size + pad * 2);
  const barH = underline ? 12 : 0;
  const height = Math.ceil(lines.length * lineH + pad + barH);
  const x = align === "center" ? width / 2 : pad;
  const anchor = align === "center" ? "middle" : "start";

  return (
    <Tag id={id} className={`${align === "center" ? "text-center" : ""} ${className}`} style={style}>
      <span className="sr-only">{lines.join("")}</span>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width={width}
        height={height}
        className={`inline-block h-auto max-w-full overflow-visible align-top ${align === "center" ? "mx-auto" : ""}`}
        aria-hidden="true"
        focusable="false"
      >
        {lines.map((line, i) => (
          <text
            key={line}
            x={x}
            y={pad + size * 0.92 + i * lineH}
            textAnchor={anchor}
            fontFamily={FONT}
            fontWeight={st.weight}
            fontSize={size}
            fill={st.fill}
            stroke={st.stroke}
            strokeWidth={st.strokeWidth}
            strokeLinejoin="round"
            paintOrder="stroke"
          >
            {segments(line, highlight).map((s, k) => (
              <tspan key={k} fill={s.hi ? "url(#sh-pink)" : undefined}>
                {s.t}
              </tspan>
            ))}
          </text>
        ))}
        {underline && (
          <>
            <rect x={width / 2 - Math.min(width * 0.32, 90)} y={height - 7} width={Math.min(width * 0.64, 180)} height="4" rx="2" fill="url(#sh-bar)" />
            <circle cx={width / 2 - Math.min(width * 0.32, 90) - 7} cy={height - 5} r="2" fill="#f5b800" />
            <circle cx={width / 2 + Math.min(width * 0.32, 90) + 7} cy={height - 5} r="2" fill="#f5b800" />
          </>
        )}
      </svg>
    </Tag>
  );
}
