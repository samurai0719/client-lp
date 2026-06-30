import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/takanaga/common/PageHero";
import CTASection from "@/components/takanaga/common/CTASection";
import { siteConfig } from "@/data/takanaga/siteConfig";

export const metadata: Metadata = {
  title: "ご依頼の流れ",
  description:
    "高長建設への外構リフォームのご依頼から施工完了までの流れをご説明します。お問い合わせから現地調査・お見積もり・施工・引き渡しまでの9ステップ。",
  alternates: { canonical: `https://${siteConfig.domain}/takanaga/flow` },
};

const STEPS = [
  {
    step: 1,
    title: "お問い合わせ",
    description:
      "Webフォームまたはお電話でお気軽にご連絡ください。現在の状況やお悩みをお聞かせいただければ、スムーズにご対応できます。",
    note: null,
  },
  {
    step: 2,
    title: "ご希望内容の確認",
    description:
      "お客様のご要望・現場の状況・ご予算の目安などをお伺いします。写真があればお送りいただくと、よりスムーズです。",
    note: null,
  },
  {
    step: 3,
    title: "現地調査",
    description:
      "担当者が現場に直接お伺いし、地盤の状態・排水の状況・重機の入れるかどうかなどを確認します。",
    note: "現地調査は無料です。",
  },
  {
    step: 4,
    title: "プランのご提案",
    description:
      "現地の状況をもとに、お客様のご要望に合ったリフォームプランをご提案します。",
    note: null,
  },
  {
    step: 5,
    title: "お見積もり",
    description:
      "工事内容・費用・工期を分かりやすくまとめたお見積もりをご提示します。不明な点はお気軽にご質問ください。",
    note: "お見積もりは無料です。",
  },
  {
    step: 6,
    title: "ご契約",
    description:
      "工事内容・費用にご納得いただいてからご契約をいただきます。お断りいただいても費用は一切かかりません。",
    note: null,
  },
  {
    step: 7,
    title: "施工日程の調整",
    description:
      "お客様のご都合・現場の状況・天気予報などを考慮して、工事日程を調整します。",
    note: null,
  },
  {
    step: 8,
    title: "工事・完了確認",
    description:
      "工事を進めながら、進捗状況をお伝えします。完了後はお客様と一緒に仕上がりをご確認いただきます。",
    note: null,
  },
  {
    step: 9,
    title: "お引き渡し・アフターフォロー",
    description:
      "工事完了後はお引き渡しとなります。工事後に気になる点があればいつでもご連絡ください。",
    note: null,
  },
];

export default function FlowPage() {
  return (
    <>
      <PageHero
        eyebrow="Flow"
        title="ご依頼から施工完了までの流れ"
        subtitle="お問い合わせから工事完了まで、9つのステップでご説明します。"
        breadcrumbs={[{ label: "ご依頼の流れ" }]}
      />

      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-(--tkn-bg)">
        <div className="mx-auto max-w-3xl">
          <ol className="space-y-6">
            {STEPS.map((step, i) => (
              <li key={step.step} className="tkn-flow-step">
                <div className="shrink-0 w-12 h-12 rounded-full bg-(--tkn-blue) flex items-center justify-center text-white text-sm font-bold flex-col">
                  <span className="text-[0.6rem] font-normal leading-none mb-0.5 opacity-75">STEP</span>
                  <span>{step.step}</span>
                </div>
                <div className="tkn-card p-5 flex-1">
                  <h2 className="text-base font-bold text-(--tkn-navy-deep) mb-2">
                    {step.title}
                  </h2>
                  <p className="text-sm text-(--tkn-text-muted) leading-relaxed">
                    {step.description}
                  </p>
                  {step.note && (
                    <p className="mt-2 text-xs font-semibold text-(--tkn-blue-bright)">
                      ✓ {step.note}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 p-6 bg-(--tkn-blue-light) rounded-xl text-center">
            <p className="text-base font-bold text-(--tkn-navy-deep) mb-2">
              まずはお気軽にご連絡ください
            </p>
            <p className="text-sm text-(--tkn-text-muted) mb-5">
              「どんな工事ができるか分からない」「費用感だけ知りたい」でも構いません。
            </p>
            <Link href="/contact" className="tkn-btn-primary">
              お問い合わせ・無料現地調査を相談する
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
