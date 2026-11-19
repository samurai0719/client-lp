import type { Metadata, Viewport } from "next";
import Link from "next/link";
import SingleMetaPixel from "@/components/analytics/SingleMetaPixel";
import ComparisonTabs from "@/components/nurse-ranking/ComparisonTabs";
import RankCard from "@/components/nurse-ranking/RankCard";
import { OfficialButton, RankBadge, Rich } from "@/components/nurse-ranking/ui";
import SvgHeading, { SvgHeadingDefs } from "@/components/nurse-shukyu3/SvgHeading";
import ConditionFilter from "@/components/nurse-shukyu3/ConditionFilter";
import { CHECKED_AT, rankingNote, shukyu3Services as services, shukyu3TableNotes } from "@/config/nurse-ranking";
import {
  CTA_LABEL,
  LEVWELL_BANNER_LINK,
  LEVWELL_NOTE,
  SHUKYU3_LINKS,
  SHUKYU3_PIXEL_ID,
  consultPoints,
  intros,
  jobCheckPoints,
  merits,
  personas,
  shukyuFaqs,
} from "@/config/nurse-shukyu3";

/**
 * 週休3日を希望する看護師向け 転職サイトおすすめ3選（/nurse-shukyu3）
 *
 * 既存LP（Wix：tenshoku-gpt.com/osusumesaito-3）の作り直し。情報の順番は tenshoku-gpt.com に合わせ、
 * 比較表・配色・カードは /nurse-ranking と同じデザインにしている。
 * 計測は既存LPの Meta Pixel（1263924312012938）だけ。共通Pixel 818 は app/layout.tsx で除外している。
 * 広告リンクは config/nurse-shukyu3.ts の SHUKYU3_LINKS（未提供のサービスは公式トップ）。
 */

const TITLE = "週休3日を希望する看護師向け 転職サイトおすすめ3選｜看護師転職 比較ナビ";
const DESCRIPTION =
  "週休3日など、お休みも収入もあきらめたくない看護師さんへ。休日の希望を相談できる看護師転職サイト3社（レバウェル看護・ナース専科 転職・看護roo!転職）を比較します。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", images: ["/images/nurse-shukyu3/nurse-photo.jpg"] },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#e8437a" };

const linkOf = (id: string) => SHUKYU3_LINKS[id];

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}年${m}月${d}日`;
}

function Divider() {
  return <div className="h-2 bg-[#fff1f5]" aria-hidden="true" />;
}

function PersonaIcon({ icon }: { icon: "calendar" | "clock" | "wallet" }) {
  const path = {
    calendar: "M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM8 12h2v2H8zM14 12h2v2h-2zM8 16h2v2H8z",
    clock: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3.5 2",
    wallet: "M4 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1V7zM4 7l11-3v3M16 13h2",
  }[icon];
  return (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#fde3ec] to-[#fff6f9] text-[#e8437a] ring-2 ring-[#f7c9d8]">
      <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={path} />
      </svg>
    </span>
  );
}

/** セクション見出し（インラインSVGの文字）＋補足文 */
function Title({ id, lines, highlight, sub }: { id: string; lines: string[]; highlight?: string[]; sub?: string }) {
  return (
    <div className="mb-4">
      <SvgHeading id={id} lines={lines} highlight={highlight} size={22} />
      {sub && <p className="mt-1.5 text-center text-[12px] text-slate-500">{sub}</p>}
    </div>
  );
}

/**
 * ファーストビューのキャッチ（インラインSVGで描く文字）。
 * 読み上げ・検索用の文言は h1 内の sr-only テキストで持つので、SVG自体は装飾として aria-hidden にする。
 * 白フチ（paint-order=stroke）・ピンクのグラデーション・「3」の強調・手書き風の下線で装飾。
 */
function FvHeadline() {
  const font = "'Hiragino Sans','Hiragino Kaku Gothic ProN','Noto Sans JP','Yu Gothic',sans-serif";
  return (
    <svg viewBox="0 0 330 168" className="block h-auto w-[62cqw] max-w-[460px] overflow-visible" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="fv-pink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff6fa5" />
          <stop offset="1" stopColor="#d6286a" />
        </linearGradient>
        <linearGradient id="fv-three" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff8ab6" />
          <stop offset=".55" stopColor="#e8437a" />
          <stop offset="1" stopColor="#b8205a" />
        </linearGradient>
        <linearGradient id="fv-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffd84d" />
          <stop offset="1" stopColor="#ffb703" />
        </linearGradient>
        <filter id="fv-shadow" x="-10%" y="-10%" width="120%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#b8205a" floodOpacity=".22" />
        </filter>
      </defs>

      {/* 1行目 */}
      <text x="2" y="40" fontFamily={font} fontWeight="900" fontSize="35" letterSpacing="-0.5" fill="#1f2a44" stroke="#fff" strokeWidth="6" strokeLinejoin="round" paintOrder="stroke" filter="url(#fv-shadow)">
        看護師だって、
      </text>

      {/* 2行目の下に敷く手書き風マーカー */}
      <path d="M4 104 C 60 96, 120 99, 176 95 S 214 93, 222 96" fill="none" stroke="url(#fv-line)" strokeWidth="11" strokeLinecap="round" opacity=".9" />

      {/* 2行目：週休3日という */}
      <text y="99" fontFamily={font} fontWeight="900" stroke="#fff" strokeWidth="6" strokeLinejoin="round" paintOrder="stroke" filter="url(#fv-shadow)">
        <tspan x="2" fontSize="44" fill="url(#fv-pink)">週休</tspan>
        <tspan fontSize="62" fill="url(#fv-three)" dy="4" fontStyle="italic">3</tspan>
        <tspan fontSize="44" fill="url(#fv-pink)" dy="-4">日</tspan>
        <tspan fontSize="28" fill="#1f2a44" dx="3">という</tspan>
      </text>

      {/* 3行目 */}
      <text x="2" y="152" fontFamily={font} fontWeight="900" fontSize="40" letterSpacing="1" fill="#1f2a44" stroke="#fff" strokeWidth="6" strokeLinejoin="round" paintOrder="stroke" filter="url(#fv-shadow)">
        選択。
      </text>

      {/* きらめき */}
      <g fill="#f5b800">
        <path d="M150 128 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" />
        <path d="M176 140 l1.8 4.6 4.6 1.8 -4.6 1.8 -1.8 4.6 -1.8 -4.6 -4.6 -1.8 4.6 -1.8z" opacity=".8" />
      </g>
    </svg>
  );
}

export default function NurseShukyu3Page() {
  const [first, ...others] = services;

  return (
    <div className="min-h-screen bg-[#fff6f9] text-slate-900">
      <SingleMetaPixel id={SHUKYU3_PIXEL_ID} />
      <SvgHeadingDefs />

      {/* ① ヘッダー・PR表記 */}
      <header className="border-b border-[#f7c9d8] bg-white">
        <div className="mx-auto flex max-w-[860px] items-center justify-between gap-3 px-4 py-2">
          <p className="flex min-w-0 items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[#e8437a]" aria-hidden="true">
              <path fill="currentColor" d="M12 21s-7.5-4.6-9.6-9.3C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4h2c.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.2C19.5 16.4 12 21 12 21z" />
              <path fill="#fff" d="M11 9h2v2.5h2.5v2H13V16h-2v-2.5H8.5v-2H11z" />
            </svg>
            <span className="truncate text-[15px] font-black tracking-tight text-slate-900">看護師転職 比較ナビ</span>
          </p>
          <span className="shrink-0 rounded border border-slate-400 px-1.5 py-0.5 text-[11px] font-bold leading-none text-slate-600">PR</span>
        </div>
        <p className="bg-[#fff1f5] px-4 py-1 text-center text-[11px] text-slate-600">本ページはプロモーション（広告）を含みます</p>
      </header>

      <main className="mx-auto max-w-[860px] bg-white shadow-[0_0_40px_rgba(232,67,122,0.06)]">
        {/* ② ファーストビュー（写真＋HTMLの文字） */}
        <section aria-labelledby="fv-title" className="relative overflow-hidden bg-gradient-to-br from-[#fff1f5] via-white to-[#fde3ec] [container-type:inline-size]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/nurse-shukyu3/nurse-photo.jpg"
            alt=""
            width={757}
            height={916}
            className="absolute bottom-0 right-0 h-full w-[48%] object-cover object-top [mask-image:linear-gradient(to_right,transparent,#000_22%)]"
            fetchPriority="high"
          />
          <div className="relative px-[4.5cqw] pb-[6cqw] pt-[5.5cqw]">
            <p className="inline-block rounded-2xl bg-white/95 px-[3.2cqw] py-[1.6cqw] text-[clamp(11px,3.4cqw,17px)] font-bold leading-snug text-[#c2386a] shadow-sm ring-1 ring-[#f7c9d8]">
              お休みも、収入も、
              <br />
              あきらめたくないあなたへ。
            </p>
            <h1 id="fv-title" className="mt-[3.5cqw]">
              <span className="sr-only">看護師だって、週休3日という選択。</span>
              <FvHeadline />
            </h1>
            <p className="mt-[4cqw] inline-block whitespace-nowrap rounded-lg bg-[#e8437a] px-[3cqw] py-[2cqw] text-[clamp(12px,3.75cqw,22px)] font-black leading-snug text-white shadow-[0_3px_0_#b8305f]">
              週休3日を希望する看護師向け
              <br />
              <span className="bg-[linear-gradient(transparent_60%,#f5c518_60%)]">転職サイトおすすめ3選</span>
            </p>
            <p className="mt-[3cqw] w-[60%] text-[clamp(10px,2.6cqw,13px)] leading-snug text-slate-600">
              {rankingNote.replace("掲載順位は", "掲載順は")}
            </p>
          </div>
        </section>

        {/* ③ おすすめ3社の紹介（比較表より先に短く） */}
        <section aria-labelledby="intro-title" className="px-3 pb-7 pt-5 min-[400px]:px-4">
          <SvgHeading id="intro-title" lines={["週休3日を希望する看護師さんに", "おすすめの3社"]} highlight={["おすすめの3社"]} size={20} className="mb-3" />

          {/* 1位：最も目立たせる */}
          <article className="overflow-hidden rounded-2xl border-[3px] border-[#e7b416] bg-[#fffbe6]">
            <div className="flex items-center gap-2 bg-gradient-to-r from-[#e7b416] to-[#f5cf4a] px-3 py-2 text-white">
              <span className="rounded-full bg-white p-0.5">
                <RankBadge rank={1} />
              </span>
              <p className="text-[18px] font-black [text-shadow:0_1px_2px_rgba(0,0,0,0.25)]">{first.name}</p>
              <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[11px] font-black text-[#b8860b]">おすすめNo.1</span>
            </div>
            <div className="px-3.5 pb-4 pt-3">
              <p className="text-center text-[17px] font-black leading-snug text-slate-900">
                <span className="bg-[linear-gradient(transparent_55%,#fff176_55%)]">{intros.levwell.heading}</span>
              </p>
              {first.adImage && (
                <a href={LEVWELL_BANNER_LINK} target="_blank" rel="nofollow sponsored noopener" className="relative mx-auto mt-3 block w-full max-w-[300px]">
                  <span className="absolute left-1 top-1 rounded bg-black/55 px-1 text-[9px] font-bold leading-[14px] text-white">広告</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={first.adImage.src} width={first.adImage.width} height={first.adImage.height} alt={first.adImage.alt} className="block h-auto w-full rounded-lg border border-slate-200" />
                </a>
              )}
              <p className="mt-3 text-[14px] leading-relaxed text-slate-700">{intros.levwell.body}</p>
              <p className="mt-1.5 text-[11px] text-slate-500">{LEVWELL_NOTE}</p>
              <div className="mt-3.5">
                <OfficialButton s={first} href={linkOf("levwell")} sub="＼ 休日の希望も伝えられる ／">
                  {CTA_LABEL}
                </OfficialButton>
              </div>
            </div>
          </article>

          {/* 2位・3位 */}
          <div className="mt-3 grid gap-3 min-[640px]:grid-cols-2">
            {others.map((s) => (
              <article key={s.id} className={`rounded-2xl border-2 bg-white p-3.5 ${s.rank === 2 ? "border-[#c3cbd6]" : "border-[#d99a62]"}`}>
                <div className="flex items-center gap-2">
                  <RankBadge rank={s.rank} />
                  <div className="min-w-0">
                    {s.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.logo.src} width={s.logo.width} height={s.logo.height} alt={s.name} className="h-9 w-auto object-contain" />
                    ) : (
                      <p className="text-[16px] font-black leading-tight text-slate-900">{s.name}</p>
                    )}
                    <p className="text-[10px] text-slate-500">運営：{s.operator}</p>
                  </div>
                </div>
                <p className="mt-2 text-[14px] font-black text-[#c2386a]">{intros[s.id].heading}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-700">{intros[s.id].body}</p>
                <div className="mt-3">
                  <OfficialButton s={s} href={linkOf(s.id)} sub="＼ 無料で相談 ／">
                    {CTA_LABEL}
                  </OfficialButton>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Divider />

        {/* ④ 転職サイトで相談するときのポイント */}
        <section aria-labelledby="consult-title" className="px-4 py-8">
          <Title id="consult-title" lines={["転職サイトで", "相談するときのポイント"]} highlight={["相談するときのポイント"]} sub="週休3日を希望するなら、この4つを整理して伝えましょう" />
          <ol className="grid gap-2.5 min-[640px]:grid-cols-2">
            {consultPoints.map((c, i) => (
              <li key={c.title} className="flex gap-3 rounded-2xl border border-[#f7c9d8] bg-[#fff6f9] p-3.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8437a] text-[15px] font-black text-white">{i + 1}</span>
                <div>
                  <p className="text-[15px] font-black text-slate-900">{c.title}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-slate-700">{c.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-3 rounded-xl bg-[#fffbe6] px-3.5 py-2.5 text-[13px] leading-relaxed text-slate-700 ring-1 ring-[#f0d77a]">
            <b className="text-slate-900">登録フォームは、実際の希望に沿って選びましょう。</b>
            希望と違う内容で登録すると、合わない求人を紹介されやすくなります。迷う項目は「相談したい」と伝えれば大丈夫です。
          </p>
        </section>

        <Divider />

        {/* ⑤ こだわり条件から比較 */}
        <section aria-labelledby="filter-title" className="px-3 py-8 min-[400px]:px-4">
          <Title id="filter-title" lines={["こだわり条件から比較"]} highlight={["こだわり条件"]} sub="希望勤務地・資格・勤務形態を選ぶと、条件で探せるサービスを表示します" />
          <ConditionFilter />
        </section>

        <Divider />

        {/* ⑥ タブ付き比較表 */}
        <section aria-labelledby="compare-title" className="px-3 py-8 min-[400px]:px-4">
          <Title id="compare-title" lines={["おすすめ3社を比較"]} highlight={["おすすめ3社"]} sub={`${rankingNote}更新日：${formatDate(CHECKED_AT)}`} />
          <ComparisonTabs caption="週休3日を希望する看護師向け 3社の比較表" list={services} notes={shukyu3TableNotes} links={SHUKYU3_LINKS} action="official" tabLabels={{ jobs: "取扱求人" }} />
        </section>

        <Divider />

        {/* ⑦ 求人例の代わりに：求人を選ぶ際の確認ポイント（出典を確認できた週休3日の求人がないため、架空の求人は作らない） */}
        <section aria-labelledby="jobcheck-title" className="px-4 py-8">
          <Title id="jobcheck-title" lines={["求人を選ぶ際の", "確認ポイント"]} highlight={["確認ポイント"]} sub="週休3日の求人を見るときは、休日の数だけでなく条件全体を確認しましょう" />
          <div className="grid gap-2.5 min-[640px]:grid-cols-2">
            {jobCheckPoints.map((c, i) => (
              <article key={c.title} className={`rounded-2xl border-2 bg-white p-3.5 ${i === jobCheckPoints.length - 1 ? "border-[#e7b416] bg-[#fffbe6] min-[640px]:col-span-2" : "border-[#f7c9d8]"}`}>
                <p className="flex items-start gap-2 text-[15px] font-black leading-snug text-slate-900">
                  <span className="mt-0.5 rounded bg-[#e8437a] px-1.5 py-0.5 text-[10px] font-black leading-none text-white">確認{i + 1}</span>
                  {c.title}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-700">{c.body}</p>
              </article>
            ))}
          </div>
        </section>

        <Divider />

        {/* ⑧ 転職サイトを利用するメリット */}
        <section aria-labelledby="merit-title" className="px-4 py-8">
          <Title id="merit-title" lines={["転職サイトを", "利用するメリット"]} highlight={["メリット"]} />
          <ul className="space-y-2.5">
            {merits.map((m) => (
              <li key={m.title} className="rounded-2xl border border-[#f7c9d8] bg-[#fff6f9] p-3.5">
                <p className="flex items-center gap-2 text-[15px] font-black text-slate-900">
                  <svg viewBox="0 0 20 20" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
                    <circle cx="10" cy="10" r="10" fill="#e8437a" />
                    <path d="M5.5 10.3l3 3 6-6.3" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {m.title}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-700">{m.body}</p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">{m.services}</p>
              </li>
            ))}
          </ul>
        </section>

        <Divider />

        {/* ⑨ こんな看護師さんにおすすめ */}
        <section aria-labelledby="persona-title" className="px-4 py-8">
          <Title id="persona-title" lines={["こんな看護師さんに", "おすすめ"]} highlight={["おすすめ"]} />
          <ul className="grid gap-2.5 min-[640px]:grid-cols-3">
            {personas.map((p, i) => (
              <li key={p.title} className="flex gap-3 rounded-2xl border-2 border-[#f7c9d8] bg-white p-3.5 min-[640px]:flex-col min-[640px]:items-center min-[640px]:text-center">
                <PersonaIcon icon={p.icon} />
                <div>
                  <p className="text-[15px] font-black text-slate-900">
                    <span className="mr-1 text-[#e8437a]">{"❶❷❸"[i]}</span>
                    {p.title}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-slate-700">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <OfficialButton s={first} href={linkOf("levwell")} sub="＼ 1位のレバウェル看護で ／">
              {CTA_LABEL}
            </OfficialButton>
          </div>
        </section>

        <Divider />

        {/* ⑩ 各社の詳細紹介（口コミは公式サイト掲載の出典つきのみ） */}
        <section aria-labelledby="detail-title" className="px-3 py-8 min-[400px]:px-4">
          <Title id="detail-title" lines={["各社の詳細"]} highlight={["詳細"]} sub={rankingNote} />
          <div className="space-y-6">
            {services.map((s) => (
              <div key={s.id}>
                <RankCard s={s} href={linkOf(s.id)} ctaLabel={CTA_LABEL} ctaSub="＼ 休日の希望も伝えられる ／" svgHeadings />
                {s.id === "levwell" && <p className="mt-1.5 px-1 text-[11px] text-slate-500">{LEVWELL_NOTE}</p>}
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ⑪ FAQ */}
        <section aria-labelledby="faq-title" className="px-4 py-8">
          <Title id="faq-title" lines={["週休3日に関する", "よくある質問"]} highlight={["週休3日"]} />
          <div className="space-y-2.5">
            {shukyuFaqs.map((f) => (
              <details key={f.question} className="group rounded-xl border border-[#f7c9d8] bg-white open:bg-[#fff6f9]">
                <summary className="flex cursor-pointer list-none items-center gap-2.5 px-3.5 py-3 text-[14px] font-black text-slate-900 [&::-webkit-details-marker]:hidden">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8437a] text-[12px] text-white">Q</span>
                  <span className="flex-1">{f.question}</span>
                  <span className="text-[#e8437a] transition group-open:rotate-180" aria-hidden="true">
                    ▾
                  </span>
                </summary>
                <div className="flex gap-2.5 px-3.5 pb-3.5 text-[13px] leading-relaxed text-slate-700">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[12px] font-black text-[#e8437a] ring-1 ring-[#f3a9c3]">A</span>
                  <p className="flex-1 pt-0.5">{f.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* 最終CTA（1位） */}
        <section aria-labelledby="final-title" className="bg-gradient-to-b from-[#fff1f5] to-[#fffbe6] px-4 py-8">
          <div className="rounded-2xl border-[3px] border-[#e7b416] bg-white p-4 text-center">
            <p className="flex items-center justify-center gap-1.5 text-[13px] font-black text-[#b8860b]">
              <RankBadge rank={1} size="sm" />
              当サイトのおすすめ1位
            </p>
            <SvgHeading id="final-title" lines={["週休3日の働き方を", "相談するなら", first.name]} highlight={[first.name]} size={22} underline={false} className="mt-1.5" />
            <p className="mt-2 text-[13px] leading-relaxed text-slate-700">
              <Rich text="休みの多さなど**希望の働き方を伝えて**、==職場の雰囲気まで確認しながら==求人を紹介してもらえます。LINEでも相談できます。" />
            </p>
            <div className="mt-4">
              <OfficialButton s={first} href={linkOf("levwell")} sub="＼ 休日の希望も伝えられる ／">
                {CTA_LABEL}
              </OfficialButton>
            </div>
            <p className="mt-2 text-[11px] text-slate-500">{LEVWELL_NOTE}</p>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="border-t border-[#f7c9d8] bg-[#fff6f9] px-4 py-8 text-center">
        <p className="text-[14px] font-black text-slate-800">看護師転職 比較ナビ</p>
        <nav className="mx-auto mt-4 flex max-w-[640px] flex-wrap justify-center gap-x-4 gap-y-2.5 text-[12px] text-slate-600" aria-label="サイト情報">
          {[
            ["/nurse-ranking/company", "運営者情報"],
            ["/nurse-ranking/privacy", "プライバシーポリシー"],
            ["/nurse-ranking/advertising-policy", "広告掲載方針"],
            ["/nurse-ranking/ranking-policy", "掲載順位について"],
            ["/nurse-ranking/company#contact", "お問い合わせ"],
          ].map(([href, label]) => (
            <Link key={label} href={href} className="hover:text-[#e8437a] hover:underline">
              {label}
            </Link>
          ))}
        </nav>
        <p className="mt-5 text-[11px] text-slate-400">© 2026 看護師転職 比較ナビ</p>
      </footer>
    </div>
  );
}
