import type { Metadata } from "next";
import Header from "@/components/nurse-ranking/Header";
import Footer from "@/components/nurse-ranking/Footer";
import ComparisonTabs from "@/components/nurse-ranking/ComparisonTabs";
import WorkStyleSection from "@/components/nurse-ranking/WorkStyleSection";
import RankCard from "@/components/nurse-ranking/RankCard";
import TopThree from "@/components/nurse-ranking/TopThree";
import FaqSection from "@/components/nurse-ranking/FaqSection";
import { SectionTitle } from "@/components/nurse-ranking/ui";
import SvgHeading, { SvgHeadingDefs } from "@/components/nurse-shukyu3/SvgHeading";
import { RANKING_EXTRA_PIXEL_ID, RANKING_PIXEL_ID, faqs, rankingNote, services, shukyuCheckPoints, siteMeta } from "@/config/nurse-ranking";
import SingleMetaPixel from "@/components/analytics/SingleMetaPixel";

/**
 * 看護師転職サイト おすすめランキング（/nurse-ranking）
 *
 * 構成：ヘッダー → FV画像 → TOP3 → タブ付き比較表 → 希望する働き方から確認 → ランキング詳細（1〜3位）
 *       → 比較するメリット → よくある質問 → 再比較表 → フッター
 * 比較表・詳細カード・FAQ はすべて config/nurse-ranking.ts の共通データから表示する。
 */

const PAGE_TITLE = `看護師 週休3日の求人 おすすめランキング｜週休3日を希望する看護師向け転職サイト比較｜${siteMeta.siteName}`;
const PAGE_DESCRIPTION =
  "週休3日など、お休みも収入もあきらめたくない看護師さんへ。休日の希望を相談できる看護師転職サイト3社（レバウェル看護・看護師ワーカー・ナースではたらこ）を比較。週休3日の求人を選ぶときの確認ポイントも紹介します。";

const canonicalUrl = siteMeta.domain ? `https://${siteMeta.domain}${siteMeta.rankingPath}` : undefined;

export const metadata: Metadata = {
  // シェア画像などの絶対URLを公開ドメイン（www.tenshoku-gpt.com）で出す
  metadataBase: siteMeta.domain ? new URL(`https://${siteMeta.domain}`) : undefined,
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION, images: [siteMeta.ogImage], type: "website", url: canonicalUrl, siteName: siteMeta.siteName, locale: "ja_JP" },
};

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}年${m}月${d}日`;
}

export default function NurseRankingPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: services.map((s) => ({ "@type": "ListItem", position: s.rank, name: s.name, url: s.officialUrl })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
    },
  ];

  return (
    <div className="min-h-screen bg-[#fff6f9] text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SingleMetaPixel id={RANKING_PIXEL_ID} />
      <SingleMetaPixel id={RANKING_EXTRA_PIXEL_ID} />
      <SvgHeadingDefs />
      <Header />

      <main className="mx-auto max-w-[860px] bg-white shadow-[0_0_40px_rgba(232,67,122,0.06)]">
        {/* ファーストビュー（文字は画像に入っているので重ねない） */}
        <h1 className="sr-only">看護師 週休3日の求人 おすすめランキング 厳選3社を比較</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/nurse-ranking/hero-shukyu3-3sha.jpg"
          width={1585}
          height={992}
          alt="週休3日で、私らしい働き方へ 看護師 週休3日の求人 おすすめランキング 厳選3社を比較"
          className="block h-auto w-full"
          fetchPriority="high"
        />

        {/* 看護師転職サイトTOP3（1位は大きく、2位・3位は横並び） */}
        <TopThree services={services} />

        {/* タブ付き比較表（上部） */}
        <section aria-labelledby="compare-top-title" className="px-3 pb-6 pt-4 min-[400px]:px-4">
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
            <SvgHeading id="compare-top-title" lines={["おすすめ3社をひと目で比較"]} highlight={["おすすめ3社"]} size={18} align="left" underline={false} />
          </div>
          <ComparisonTabs caption="おすすめ3社の比較表" action="official" />
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
            ※{rankingNote}各社の情報は公式サイトの記載をもとにしています（{formatDate(siteMeta.contentUpdatedAt)}確認）。最新の情報は各社の公式サイトでご確認ください。「公式サイト」ボタンを押すと外部サイトへ移動します。
          </p>
        </section>

        <div className="h-2 bg-[#fff1f5]" aria-hidden="true" />

        <WorkStyleSection />

        <div className="h-2 bg-[#fff1f5]" aria-hidden="true" />

        {/* 週休3日の求人を選ぶときの確認ポイント */}
        <section aria-labelledby="shukyu-check-title" className="px-4 py-8">
          <SectionTitle
            id="shukyu-check-title"
            lines={["週休3日の求人を", "選ぶときの確認ポイント"]}
            highlight={["週休3日"]}
            sub="休日の数だけでなく、条件全体を確認しましょう"
          />
          <ol className="grid gap-2.5 min-[640px]:grid-cols-2">
            {shukyuCheckPoints.map((c, i) => (
              <li
                key={c.title}
                className={`rounded-2xl border-2 p-3.5 ${i === shukyuCheckPoints.length - 1 ? "border-[#e7b416] bg-[#fffbe6] min-[640px]:col-span-2" : "border-[#f7c9d8] bg-white"}`}
              >
                <p className="flex items-start gap-2 text-[15px] font-black leading-snug text-slate-900">
                  <span className="mt-0.5 shrink-0 whitespace-nowrap rounded bg-[#e8437a] px-1.5 py-0.5 text-[10px] font-black leading-none text-white">確認{i + 1}</span>
                  {c.title}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-700">{c.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="h-2 bg-[#fff1f5]" aria-hidden="true" />

        {/* ランキング詳細 */}
        <section aria-labelledby="ranking-title" className="px-3 py-8 min-[400px]:px-4">
          <SectionTitle id="ranking-title" lines={["週休3日を希望する看護師向け", "おすすめランキング"]} highlight={["おすすめランキング"]} sub={rankingNote} />
          <div className="space-y-6">
            {services.map((s) => (
              <RankCard key={s.id} s={s} svgHeadings ctaBig ctaLabel="無料で求人を見てみる" />
            ))}
          </div>
        </section>

        <div className="h-2 bg-[#fff1f5]" aria-hidden="true" />

        {/* 複数サービスを比較するメリット */}
        <section aria-labelledby="merit-title" className="px-4 py-8">
          <SectionTitle id="merit-title" lines={["複数のサービスを", "比較するメリット"]} highlight={["メリット"]} />
          <p className="rounded-2xl border border-[#f7c9d8] bg-[#fff6f9] p-4 text-[14px] leading-relaxed text-slate-700">
            紹介される求人や担当者との相性には違いがあるため、
            <mark className="bg-[linear-gradient(transparent_55%,#fff176_55%)] font-bold text-inherit">気になるサービスを比較して選びましょう</mark>
            。相談方法（電話・LINE）やサポート内容も、サービスごとに異なります。
          </p>
        </section>

        <div className="h-2 bg-[#fff1f5]" aria-hidden="true" />

        <FaqSection />

        <div className="h-2 bg-[#fff1f5]" aria-hidden="true" />

        {/* おすすめ3社の再比較表（上部とは独立したタブ） */}
        <section aria-labelledby="compare-bottom-title" className="px-3 py-8 min-[400px]:px-4">
          <SectionTitle id="compare-bottom-title" lines={["おすすめ3社を", "もう一度比較"]} highlight={["おすすめ3社"]} />
          <ComparisonTabs caption="おすすめ3社の再比較表" action="official" />
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
            ※{rankingNote}「公式サイト」ボタンを押すと外部サイトへ移動します。
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
