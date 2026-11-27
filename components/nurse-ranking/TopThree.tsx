import { linkOf, type Service } from "@/config/nurse-ranking";
import { RankBadge } from "./ui";

/**
 * ファーストビュー直下の「看護師転職サイトTOP3」。
 * 1位は広告素材＋説明＋大きいボタン、2位・3位は横並びの小さいカード。
 * 見出しの帯と説明文は config の各社データ（feature・points・recommendedFor）で確認できる内容だけで書く。
 */

type Pick = {
  /** 帯の一言 */
  band: string;
  /** 説明文。[[ ]] で囲んだ部分を赤字にし、/ の位置でだけ改行する（語の途中で折り返さない） */
  text: string;
  /** 説明文の数値の注記 */
  note?: string;
};

const PICKS: Record<string, Pick> = {
  levwell: {
    band: "職場の雰囲気まで知りたいなら！",
    text: "看護師求人数/[[23万件以上※]]。/[[職場の雰囲気や]]/[[離職率]]など、/求人票では/分かりにくい/情報も/確認できます。/[[LINEでも相談]]/できるので、/まずは気軽に/求人を/見てみましょう。",
    note: "※公式サイトの記載/（2025年9月2日時点／/常勤・派遣求人、/非公開求人を含む）",
  },
  "nurse-worker": {
    band: "パートの方はコチラ！",
    text: "週3〜4日から働けるパートも多数。給与や入職日の交渉もアドバイザーにお任せ！",
  },
  hatarako: {
    band: "行きたい病院があるなら！",
    text: "働きたい病院を逆指名でき、求人が出ていなくても状況を確認してもらえる！",
  },
};

const BAND = {
  1: "bg-[#efe6c8]",
  2: "bg-[#cfd0ee]",
  3: "bg-[#eaa36c] text-white",
} as const;

function Red({ text }: { text: string }) {
  return (
    <>
      {text.split("/").map((chunk, i) => (
        <span key={i} className="inline-block whitespace-nowrap">
          {chunk.split(/(\[\[.+?\]\])/).map((part, j) =>
            part.startsWith("[[") ? (
              <span key={j} className="text-[#e0534a]">
                {part.slice(2, -2)}
              </span>
            ) : (
              part
            ),
          )}
        </span>
      ))}
    </>
  );
}

function Logo({ s, className }: { s: Service; className: string }) {
  if (!s.logo) return <span className="text-[17px] font-black text-slate-900">{s.name}</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={s.logo.src} width={s.logo.width} height={s.logo.height} alt={s.name} className={`h-auto w-auto ${className}`} loading="lazy" />;
}

function Medal({ rank }: { rank: 1 | 2 | 3 }) {
  return (
    <div className="relative z-10 -mb-3 flex justify-center">
      <span className="rounded-full bg-white p-1 shadow-sm">
        <RankBadge rank={rank} size={rank === 1 ? "lg" : "md"} />
      </span>
    </div>
  );
}

function First({ s }: { s: Service }) {
  const pick = PICKS[s.id];
  const href = linkOf(s);
  return (
    <div>
      <Medal rank={1} />
      <article className="overflow-hidden rounded-2xl border border-[#d9d6e8] bg-[#f6f7fd] shadow-[0_2px_6px_rgba(60,60,110,0.12)]">
        <p className={`px-3 pb-2.5 pt-4 text-center text-[clamp(14px,4.3vw,17px)] font-bold text-slate-700 ${BAND[1]}`}>{pick.band}</p>
        <div className="px-3.5 pb-5 pt-3 min-[400px]:px-4">
          <div className="flex items-center justify-between gap-2">
            <Logo s={s} className="max-h-[30px] max-w-[60%]" />
            <span className="shrink-0 rounded-lg bg-[#e8604c] px-3 py-1.5 text-[13px] font-black text-white">オススメ！</span>
          </div>
          <div className="mt-3 flex items-start gap-3">
            {s.adImage && (
              <a href={href} target="_blank" rel="nofollow sponsored noopener" className="relative block w-[42%] max-w-[180px] shrink-0" data-service={s.id}>
                <span className="absolute left-1 top-1 rounded bg-black/55 px-1 text-[9px] font-bold leading-[14px] text-white">広告</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.adImage.src} width={s.adImage.width} height={s.adImage.height} alt={s.adImage.alt} className="block h-auto w-full rounded border border-slate-200" loading="lazy" />
              </a>
            )}
            <p className="min-w-0 text-[clamp(13px,3.8vw,15px)] leading-[1.75] text-slate-700">
              <Red text={pick.text} />
            </p>
          </div>
          {pick.note && <p className="mt-2 text-[10px] leading-snug text-slate-500"><Red text={pick.note} /></p>}
          <a
            href={href}
            target="_blank"
            rel="nofollow sponsored noopener"
            data-service={s.id}
            data-cta="top3-1"
            className="nr-shine mx-auto mt-4 flex min-h-[72px] w-full max-w-[460px] flex-col items-center justify-center rounded-full bg-[#56c1cf] px-4 py-2.5 text-center font-black leading-snug text-white shadow-[0_5px_0_#3a9aa7] transition active:translate-y-[3px] active:shadow-[0_2px_0_#3a9aa7]"
          >
            <span className="whitespace-nowrap text-[clamp(16px,4.8vw,21px)]">{s.name}</span>
            <span className="whitespace-nowrap text-[clamp(16px,4.8vw,21px)]">無料で求人を見てみる</span>
          </a>
        </div>
      </article>
    </div>
  );
}

function Small({ s }: { s: Service }) {
  const pick = PICKS[s.id];
  const href = linkOf(s);
  return (
    <div className="flex flex-col">
      <Medal rank={s.rank} />
      <article className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-[#d9d6e8] bg-[#f6f7fd] shadow-[0_2px_6px_rgba(60,60,110,0.12)]">
        <p className={`flex min-h-[52px] items-center justify-center px-1 pb-2 pt-4 text-center text-[clamp(11px,3.4vw,15px)] font-bold leading-snug text-slate-700 [word-break:keep-all] ${BAND[s.rank]}`}>
          {pick.band}
        </p>
        <div className="flex flex-1 flex-col items-center px-2.5 pb-4 pt-3">
          <div className="flex h-[34px] items-center justify-center">
            <Logo s={s} className="max-h-[30px] max-w-full" />
          </div>
          <p className="mt-2 flex-1 text-center text-[clamp(12px,3.5vw,14px)] leading-[1.7] text-slate-700 [line-break:strict] [word-break:auto-phrase] [text-wrap:pretty]">{pick.text}</p>
          <a
            href={href}
            target="_blank"
            rel="nofollow sponsored noopener"
            data-service={s.id}
            data-cta={`top3-${s.rank}`}
            className="mt-3 flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#56c1cf] px-2 text-[clamp(13px,3.8vw,15px)] font-bold text-white shadow-[0_3px_0_#3a9aa7] transition active:translate-y-[2px] active:shadow-[0_1px_0_#3a9aa7]"
          >
            求人を見る
          </a>
        </div>
      </article>
    </div>
  );
}

export default function TopThree({ services }: { services: Service[] }) {
  const [first, ...rest] = services;
  return (
    <section aria-labelledby="top3-title" className="bg-[#f3f2fb] px-3 pb-7 pt-5 min-[400px]:px-4">
      <h2 id="top3-title" className="mb-3 flex items-end justify-center gap-1.5 text-center font-black leading-none text-slate-700">
        <span aria-hidden="true" className="text-[clamp(26px,8vw,36px)]">🏆</span>
        <span className="whitespace-nowrap text-[clamp(22px,6.6vw,32px)] tracking-wide">看護師転職サイト</span>
        <span className="whitespace-nowrap text-[clamp(22px,6.6vw,32px)] tracking-wide">
          TOP<span className="text-[clamp(34px,10vw,48px)] text-[#e9a6c4]">3</span>
        </span>
      </h2>
      {first && <First s={first} />}
      <div className="mt-6 grid grid-cols-2 gap-2.5 min-[400px]:gap-3.5">
        {rest.map((s) => (
          <Small key={s.id} s={s} />
        ))}
      </div>
    </section>
  );
}
