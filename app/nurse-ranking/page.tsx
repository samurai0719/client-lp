import type { Metadata } from "next";
import Header from "@/components/nurse-ranking/Header";
import Footer from "@/components/nurse-ranking/Footer";
import ComparisonTabs from "@/components/nurse-ranking/ComparisonTabs";
import WorkStyleSection from "@/components/nurse-ranking/WorkStyleSection";
import RankCard from "@/components/nurse-ranking/RankCard";
import FaqSection from "@/components/nurse-ranking/FaqSection";
import { SectionTitle } from "@/components/nurse-ranking/ui";
import SvgHeading, { SvgHeadingDefs } from "@/components/nurse-shukyu3/SvgHeading";
import { faqs, rankingNote, services, siteMeta } from "@/config/nurse-ranking";

/**
 * 看護師転職サイト おすすめランキング（/nurse-ranking）
 *
 * 構成：ヘッダー → FV画像 → タブ付き比較表 → 希望する働き方から確認 → ランキング詳細（1〜3位）
 *       → 比較するメリット → よくある質問 → 再比較表 → フッター
 * 比較表・詳細カード・FAQ はすべて config/nurse-ranking.ts の共通データから表示する。
 */

const PAGE_TITLE = `看護師転職サイトおすすめランキング｜厳選3社を比較｜${siteMeta.siteName}`;
const PAGE_DESCRIPTION =
  "看護師向け転職サイト3社（レバウェル看護・看護師ワーカー・ナースではたらこ）の特徴、相談方法、転職サポートを公式情報をもとに比較。希望する働き方ごとの相談のポイントも紹介します。";

const canonicalUrl = siteMeta.domain ? `https://${siteMeta.domain}/nurse-ranking` : undefined;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
  openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION, images: [siteMeta.ogImage], type: "website" },
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
      <SvgHeadingDefs />
      <Header />

      <main className="mx-auto max-w-[860px] bg-white shadow-[0_0_40px_rgba(232,67,122,0.06)]">
        {/* ファーストビュー（文字は画像に入っているので重ねない） */}
        <h1 className="sr-only">看護師 転職サイト おすすめランキング 厳選3社を比較</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/nurse-ranking/hero-v2.jpg"
          width={1585}
          height={992}
          alt="あなたに合う転職先探しに 看護師転職サイトおすすめランキング 厳選3社を比較"
          className="block h-auto w-full"
          fetchPriority="high"
        />

        {/* タブ付き比較表（上部） */}
        <section aria-labelledby="compare-top-title" className="px-3 pb-6 pt-4 min-[400px]:px-4">
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
            <SvgHeading id="compare-top-title" lines={["おすすめ3社をひと目で比較"]} highlight={["おすすめ3社"]} size={18} align="left" underline={false} />
            <p className="text-[11px] text-slate-500">
              更新日：<time dateTime={siteMeta.contentUpdatedAt}>{formatDate(siteMeta.contentUpdatedAt)}</time>
            </p>
          </div>
          <ComparisonTabs caption="おすすめ3社の比較表" />
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
            ※{rankingNote}各社の情報は公式サイトの記載をもとにしています（{formatDate(siteMeta.contentUpdatedAt)}確認）。最新の情報は各社の公式サイトでご確認ください。「公式サイト」ボタンを押すと外部サイトへ移動します。
          </p>
        </section>

        <div className="h-2 bg-[#fff1f5]" aria-hidden="true" />

        <WorkStyleSection />

        <div className="h-2 bg-[#fff1f5]" aria-hidden="true" />

        {/* ランキング詳細 */}
        <section aria-labelledby="ranking-title" className="px-3 py-8 min-[400px]:px-4">
          <SectionTitle id="ranking-title" lines={["看護師転職サイト", "おすすめランキング"]} highlight={["おすすめランキング"]} sub={rankingNote} />
          <div className="space-y-6">
            {services.map((s) => (
              <RankCard key={s.id} s={s} svgHeadings ctaBig ctaLabel="非公開求人を紹介してもらう" />
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
          <ComparisonTabs caption="おすすめ3社の再比較表" />
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
            ※{rankingNote}「公式サイト」ボタンを押すと外部サイトへ移動します。
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
