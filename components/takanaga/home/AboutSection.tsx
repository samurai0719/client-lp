import AnimateOnScroll from "@/components/takanaga/common/AnimateOnScroll";
import CountUp from "@/components/takanaga/common/CountUp";

const STATS = [
  {
    value: 1000,
    suffix: "件+",
    label: "施工実績",
    useCountUp: true,
  },
  {
    value: 3,
    suffix: "県",
    label: "対応エリア",
    useCountUp: true,
  },
  {
    value: 0,
    label: "無料調査",
    display: "無料",
    useCountUp: false,
  },
];

export default function AboutSection() {
  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-(--tkn-bg)">
      <div className="mx-auto max-w-5xl">
        {/* 見出し */}
        <AnimateOnScroll variant="up" className="text-center mb-12">
          <p className="tkn-eyebrow justify-center mb-3">About</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-(--tkn-navy-deep) leading-tight mb-3">
            高長建設について
          </h2>
          <span className="tkn-heading-line mx-auto" />
        </AnimateOnScroll>

        {/* 統計 */}
        <div className="grid grid-cols-3 gap-2 sm:gap-8 mb-12">
          {STATS.map((stat, i) => (
            <AnimateOnScroll key={stat.label} variant="scale" delay={i * 120}>
              <div className="text-center p-3 sm:p-8 rounded-2xl border border-(--tkn-border) bg-white shadow-sm">
                <div
                  className="font-black text-(--tkn-blue) mb-1 sm:mb-2 leading-none"
                  style={{ fontSize: "clamp(1.4rem, 5.5vw, 3rem)" }}
                >
                  {stat.display ? (
                    stat.display
                  ) : stat.useCountUp ? (
                    <CountUp target={stat.value} suffix={stat.suffix ?? ""} />
                  ) : (
                    `${stat.value}${stat.suffix ?? ""}`
                  )}
                </div>
                <div className="text-[0.65rem] sm:text-sm font-semibold text-(--tkn-text-muted) leading-tight">
                  {stat.label}
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* テキスト */}
        <AnimateOnScroll variant="up" delay={100}>
          <div className="max-w-2xl mx-auto space-y-5 text-(--tkn-text) text-base sm:text-lg leading-relaxed">
            <p>
              高長建設は、岐阜県・愛知県・三重県を中心とした東海エリアで、
              既存住宅の外構リフォームを専門に手がけています。
            </p>
            <p>
              外構を新しくすることが目的ではなく、今の暮らしで感じている不便を解消し、
              毎日の生活をより快適にするための提案をすることを大切にしています。
            </p>
            <p>
              「駐車場が使いにくい」「雑草に毎年悩まされている」「古くなった外構を何とかしたい」。
              そんなお悩みに対して、現地をしっかり確認した上で、お客様に合ったプランをご提案します。
            </p>
            <p>
              小規模な部分工事から外構全体のリフォームまで、規模を問わずご相談ください。
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
