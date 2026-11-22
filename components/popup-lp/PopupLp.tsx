import type { CSSProperties } from 'react';

export type PopupLpProps = {
  /** 画面上部の【PR】表記 */
  prLabel: string;
  /** 背景に敷く画像（画面いっぱいに広げ、暗いフィルターをかける） */
  background: { src: string; position?: string; size?: string; color?: string };
  /** 問いかけの上の小さな一文 */
  lead: string;
  question: string;
  /** どちらを押しても affiliateUrl へ飛ぶ */
  choices: { label: string; color: string; shadow: string }[];
  affiliateUrl: string;
  /** ポップアップの背景色と問いかけの文字色 */
  theme: { card: string; accent: string };
  /** 画面下の広告表記 */
  note: string;
};

/**
 * 背景画像の上に「あなたの今のお気持ちは？」のポップアップだけを置く、1画面のLP。
 * 選択肢はどちらもアフィリエイトリンク（押したらそのまま広告主のサイトへ）。
 */
export default function PopupLp({ prLabel, background, lead, question, choices, affiliateUrl, theme, note }: PopupLpProps) {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-slate-800">
      {/* 背景画像＋暗いフィルター */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-no-repeat"
        style={
          {
            backgroundImage: `url(${background.src})`,
            backgroundPosition: background.position ?? 'center',
            backgroundSize: background.size ?? 'cover',
            backgroundColor: background.color,
          } as CSSProperties
        }
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/45" />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-[520px] flex-col">
        <p className="bg-white/90 px-4 py-1.5 text-center text-[11px] font-semibold tracking-wide text-slate-500">{prLabel}</p>

        <main className="flex flex-1 items-center justify-center px-5 py-8">
          <section
            aria-labelledby="popup-question"
            className="w-full rounded-[28px] px-5 pt-9 pb-8 shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
            style={{ background: theme.card }}
          >
            {/* 改行で記号や1文字だけが次の行に落ちないよう、どちらも1行に収めて文字の大きさを画面幅に合わせる */}
            <p className="text-center text-[clamp(12px,3.7vw,15px)] font-bold whitespace-nowrap text-slate-700">{lead}</p>
            <h1
              id="popup-question"
              className="mt-2 text-center text-[clamp(19px,5.9vw,24px)] font-extrabold leading-snug tracking-wide whitespace-nowrap"
              style={{ color: theme.accent }}
            >
              {question}
            </h1>

            <div className="mt-7 flex flex-col gap-4">
              {choices.map((c) => (
                <a
                  key={c.label}
                  href={affiliateUrl}
                  rel="nofollow sponsored"
                  data-cta={c.label}
                  className="flex min-h-[76px] items-center justify-between gap-3 rounded-full pr-3 pl-[clamp(18px,6.5vw,32px)] text-white transition-transform duration-150 active:scale-[0.97]"
                  style={{ background: c.color, boxShadow: `0 6px 0 ${c.shadow}` }}
                >
                  <span className="text-[clamp(15px,4.8vw,20px)] font-bold tracking-wide whitespace-nowrap">{c.label}</span>
                  <span
                    aria-hidden="true"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-xl font-bold"
                    style={{ color: c.color }}
                  >
                    →
                  </span>
                </a>
              ))}
            </div>
          </section>
        </main>

        <p className="px-5 pb-5 text-center text-[10px] leading-relaxed text-white/80">{note}</p>
      </div>
    </div>
  );
}
