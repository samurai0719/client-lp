import type { ReactNode } from "react";
import { destinationName, linkOf, type Service } from "@/config/nurse-ranking";
import SvgHeading from "@/components/nurse-shukyu3/SvgHeading";

/**
 * 看護師転職ランキングの共通部品。
 *   Rich        … 「**太字**」「==黄色マーカー==」を含む文字列を表示
 *   RankBadge   … 金・銀・銅の王冠＋順位
 *   ServiceName … ロゴ（正規素材が無いので文字表示）＋順位
 *   OfficialButton … 公式サイトへの緑のボタン（外部サイトへの遷移を明示）
 */

/** ==マーカー== だけを解釈する */
function Marks({ text }: { text: string }) {
  const parts = text.split(/(==[^=]+?==)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("==") && p.endsWith("==") ? (
          <mark key={i} className="bg-[linear-gradient(transparent_55%,#fff176_55%)] font-bold text-inherit">
            {p.slice(2, -2)}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

/** 「**太字**」と「==黄色マーカー==」を含む文字列を表示する（太字の中にマーカーを入れてよい） */
export function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*.+?\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <b key={i} className="font-bold text-slate-900">
            <Marks text={p.slice(2, -2)} />
          </b>
        ) : (
          <Marks key={i} text={p} />
        ),
      )}
    </>
  );
}

const RANK_COLORS = {
  1: { fill: "#f5b800", stroke: "#b07a00", text: "text-[#9a6b00]", label: "1位" },
  2: { fill: "#c3cbd6", stroke: "#7d8794", text: "text-slate-500", label: "2位" },
  3: { fill: "#d99a62", stroke: "#97603a", text: "text-[#97603a]", label: "3位" },
} as const;

/** 王冠つきの順位 */
export function RankBadge({ rank, size = "md" }: { rank: 1 | 2 | 3; size?: "sm" | "md" | "lg" }) {
  const c = RANK_COLORS[rank];
  const box = size === "lg" ? "h-12 w-12" : size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const num = size === "lg" ? "text-[15px]" : size === "sm" ? "text-[10px]" : "text-[12px]";
  return (
    <span className={`relative inline-flex ${box} shrink-0 items-end justify-center`} aria-label={`第${rank}位`}>
      <svg viewBox="0 0 32 28" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d="M3 9l6.5 6L16 3l6.5 12L29 9l-2.6 15H5.6L3 9z" fill={c.fill} stroke={c.stroke} strokeWidth="1.3" strokeLinejoin="round" />
        <circle cx="16" cy="3" r="1.8" fill={c.fill} stroke={c.stroke} strokeWidth="0.8" />
        <circle cx="3" cy="8.5" r="1.6" fill={c.fill} stroke={c.stroke} strokeWidth="0.8" />
        <circle cx="29" cy="8.5" r="1.6" fill={c.fill} stroke={c.stroke} strokeWidth="0.8" />
      </svg>
      <span className={`relative mb-[12%] font-black leading-none text-white ${num} [text-shadow:0_1px_1px_rgba(0,0,0,0.35)]`}>{rank}</span>
    </span>
  );
}

/** サービス名（正規ロゴの提供が無いため文字で表示する） */
export function ServiceName({ s, compact = false }: { s: Service; compact?: boolean }) {
  return (
    <span className="flex min-w-0 flex-col items-center text-center">
      <RankBadge rank={s.rank} size={compact ? "sm" : "md"} />
      <span className={`mt-1 font-black leading-tight text-slate-900 [word-break:keep-all] ${compact ? "text-[12px]" : "text-[13px]"}`}>{s.name}</span>
      {s.sub && !compact && <span className="mt-0.5 text-[10px] leading-tight text-slate-500">{s.sub}</span>}
    </span>
  );
}

/**
 * 公式サイトへのボタン。外部サイトへ移動することを明示する。
 * size="sm" は比較表用（「公式サイト」）、"lg" は詳細カード用（「〇〇の公式サイトを見る」＋補足）。
 */
export function OfficialButton({
  s,
  size = "lg",
  children,
  href,
  sub = "＼ 無料で転職相談 ／",
  big = false,
}: {
  s: Service;
  size?: "sm" | "lg";
  children?: ReactNode;
  /** 遷移先を上書きする（LPごとの広告リンク）。省略時は設定ファイルの広告リンク→公式トップ */
  href?: string;
  /** ボタン上段の小さい文言 */
  sub?: string;
  /** ひと回り大きいボタンにする（ランキングページの詳細カード用） */
  big?: boolean;
}) {
  const common = {
    href: href ?? linkOf(s),
    target: "_blank",
    rel: "nofollow sponsored noopener",
    "data-service": s.id,
  } as const;
  if (size === "sm") {
    return (
      <a
        {...common}
        aria-label={`${destinationName(s, common.href)}の公式サイト（外部サイト）へ`}
        className="nr-shine inline-flex min-h-[44px] w-full flex-col items-center justify-center rounded-lg bg-gradient-to-b from-[#2fbf5b] to-[#1e9e46] px-1.5 py-1.5 text-center text-[11px] font-black leading-tight text-white shadow-[0_3px_0_#16793a] transition active:translate-y-[2px] active:shadow-[0_1px_0_#16793a]"
      >
        公式
        <br />
        サイト
        <ExternalIcon className="mt-0.5 h-2.5 w-2.5" />
      </a>
    );
  }
  const label = children ?? `${s.name}の公式サイトを見る`;
  const labelLen = typeof label === "string" ? label.length : 0;
  return (
    <div className={`mx-auto w-full text-center ${big ? "max-w-[520px]" : "max-w-[460px]"}`}>
      <a
        {...common}
        className={`nr-shine group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#2fbf5b] to-[#1e9e46] font-black text-white transition hover:brightness-105 active:translate-y-[3px] active:shadow-[0_1px_0_#16793a] ${
          big
            ? "min-h-[72px] px-7 py-3.5 text-[14px] min-[360px]:px-9 shadow-[0_5px_0_#16793a,0_10px_22px_rgba(30,158,70,0.3)] min-[360px]:text-[17px] min-[400px]:text-[19px] min-[640px]:min-h-[78px] min-[640px]:text-[21px]"
            : "min-h-[58px] px-8 py-3 text-[13.5px] min-[360px]:px-10 shadow-[0_4px_0_#16793a,0_8px_18px_rgba(30,158,70,0.25)] min-[360px]:text-[15px] min-[400px]:text-[16px]"
        }`}
      >
        <span className="flex flex-col leading-tight">
          <span className={`font-bold text-white/90 ${big ? "text-[12px] min-[640px]:text-[13px]" : "text-[11px]"}`}>{sub}</span>
          <span className={labelLen > 16 ? "text-[13.5px] min-[400px]:text-[15px]" : ""}>{label}</span>
        </span>
        {/* 外部リンクの矢印はボタンの右端に置く（文言は中央のまま） */}
        <ExternalIcon className={`absolute top-1/2 -translate-y-1/2 transition group-hover:translate-x-0.5 ${big ? "right-3.5 h-5 w-5 min-[360px]:right-5" : "right-3 h-4 w-4 min-[360px]:right-4"}`} />
      </a>
      <p className="mt-1.5 text-[11px] text-slate-500">
        <b className="font-bold text-slate-700">{destinationName(s, common.href)}</b> 公式サイトへ（外部サイトに移動します）
      </p>
    </div>
  );
}

export function ExternalIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`fill-none stroke-current ${className}`} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

/**
 * セクション見出し（h2）。文字はインラインSVGで描く（ページに <SvgHeadingDefs /> が必要）。
 * lines で改行位置、highlight でピンクにする語を指定する。
 */
export function SectionTitle({ id, lines, highlight, sub }: { id?: string; lines: string[]; highlight?: string[]; sub?: string }) {
  return (
    <div className="mb-4">
      <SvgHeading id={id} lines={lines} highlight={highlight} size={22} />
      {sub && <p className="mt-1.5 text-center text-[12px] text-slate-500">{sub}</p>}
    </div>
  );
}
