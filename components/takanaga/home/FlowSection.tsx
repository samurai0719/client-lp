import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimateOnScroll from "@/components/takanaga/common/AnimateOnScroll";

const STEPS = [
  {
    title: "お問い合わせ",
    description: "Webフォームまたはお電話でお気軽にご連絡ください。",
    icon: "📞",
  },
  {
    title: "ご希望内容の確認",
    description: "お悩みやご要望、工事のご希望についてお伺いします。",
    icon: "💬",
  },
  {
    title: "現地調査",
    description: "現場を直接確認します。現地調査は無料です。",
    icon: "🔍",
  },
  {
    title: "プランのご提案",
    description: "現地の状況に合わせたリフォームプランをご提案します。",
    icon: "📋",
  },
  {
    title: "お見積もり",
    description: "工事内容と費用を分かりやすくご説明します。",
    icon: "📄",
  },
  {
    title: "ご契約",
    description: "内容にご納得いただいてからご契約をいただきます。",
    icon: "✍️",
  },
  {
    title: "施工日程の調整",
    description: "お客様のご都合に合わせて工事日程を調整します。",
    icon: "📅",
  },
  {
    title: "工事・完了確認",
    description: "工事完了後はお客様と一緒に仕上がりをご確認します。",
    icon: "🏗️",
  },
  {
    title: "お引き渡し・アフターフォロー",
    description: "工事後もお気軽にご相談ください。",
    icon: "🏠",
  },
];

export default function FlowSection() {
  return (
    <section
      className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-(--tkn-bg)"
      aria-labelledby="flow-heading"
    >
      <div className="mx-auto max-w-4xl">
        <AnimateOnScroll variant="up" className="text-center mb-10">
          <p className="tkn-eyebrow justify-center mb-3">Flow</p>
          <h2
            id="flow-heading"
            className="text-2xl sm:text-3xl font-bold text-(--tkn-navy-deep) leading-tight"
          >
            ご依頼から施工完了までの流れ
          </h2>
          <span className="tkn-heading-line mx-auto mt-3" />
        </AnimateOnScroll>

        {/* デスクトップ：左右交互レイアウト / モバイル：縦並び */}
        <ol className="relative">
          {/* 縦ライン（デスクトップ中央、モバイル左） */}
          <div
            className="absolute left-[1.375rem] lg:left-1/2 top-0 bottom-0 w-0.5 -ml-px"
            style={{ background: "linear-gradient(to bottom, var(--tkn-blue-bright), var(--tkn-blue-light))" }}
            aria-hidden
          />

          {STEPS.map((step, i) => {
            const isRight = i % 2 === 0;
            return (
              <AnimateOnScroll key={i} variant={isRight ? "right" : "up"} delay={i * 60} as="li">
                <div className={`relative flex items-start gap-4 mb-8 lg:gap-0 ${isRight ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                  {/* バッジ（中央） */}
                  <div className="relative z-10 flex-shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:top-0">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-black shadow-lg"
                      style={{ background: "linear-gradient(135deg, #2d7dd2, #1d5fa6)" }}
                    >
                      {i + 1}
                    </div>
                  </div>

                  {/* コンテンツ */}
                  <div className={`lg:w-[45%] ${isRight ? "lg:pr-14 lg:text-right" : "lg:pl-14 lg:ml-auto"} pl-4 lg:pl-0`}>
                    <div className="bg-white rounded-xl p-4 border border-(--tkn-border) shadow-sm hover:border-(--tkn-blue-bright) hover:shadow-md transition-all">
                      <div className={`flex items-center gap-2 mb-2 ${isRight ? "lg:flex-row-reverse" : ""}`}>
                        <span className="text-xl" aria-hidden>{step.icon}</span>
                        <h3 className="text-sm font-bold text-(--tkn-navy-deep)">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-xs text-(--tkn-text-muted) leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
        </ol>

        <AnimateOnScroll variant="fade" delay={100} className="text-center mt-10">
          <Link
            href="/flow"
            className="inline-flex items-center gap-2 text-sm font-semibold text-(--tkn-blue-bright) hover:text-(--tkn-navy) transition-colors"
          >
            ご依頼の流れの詳細を見る
            <ArrowRight size={16} aria-hidden />
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
