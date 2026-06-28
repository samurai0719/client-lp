import Image from "next/image";
import AnimateOnScroll from "@/components/takanaga/common/AnimateOnScroll";

const PROBLEMS = [
  { img: "/images/gaikou/problems/problem-1.png", text: "駐車スペースを広げたい" },
  { img: "/images/gaikou/problems/problem-2.png", text: "砂利の駐車場をコンクリートにしたい" },
  { img: "/images/gaikou/problems/problem-3.png", text: "雨の日に車の乗り降りが大変" },
  { img: "/images/gaikou/problems/problem-4.png", text: "道路や隣家からの視線が気になる" },
  { img: "/images/gaikou/problems/problem-5.png", text: "庭の草むしりを減らしたい" },
  { img: "/images/gaikou/problems/problem-6.png", text: "古くなった門やフェンスを交換したい" },
  { img: "/images/gaikou/problems/problem-7.png", text: "空いている庭を有効活用したい" },
  { img: "/images/gaikou/problems/problem-8.png", text: "外構全体が古く見える" },
  { img: "/images/gaikou/problems/problem-9.png", text: "玄関まわりをきれいにしたい" },
];

export default function ProblemsSection() {
  return (
    <section
      className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-(--tkn-warm-gray) tkn-section-alt"
      aria-labelledby="problems-heading"
    >
      <div className="mx-auto max-w-5xl">
        <AnimateOnScroll variant="up" className="text-center mb-10">
          <p className="tkn-eyebrow justify-center mb-3">お悩みはありませんか？</p>
          <h2
            id="problems-heading"
            className="text-2xl sm:text-3xl font-bold text-(--tkn-navy-deep) leading-tight"
          >
            こんなお悩み、ありませんか
          </h2>
          <span className="tkn-heading-line mx-auto mt-3" />
        </AnimateOnScroll>

        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {PROBLEMS.map((p, i) => (
            <AnimateOnScroll key={i} variant="scale" delay={i * 60} as="li">
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] group">
                <Image
                  src={p.img}
                  alt={p.text}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 48vw"
                />
                {/* オーバーレイ */}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(15,39,68,0.85) 0%, rgba(15,39,68,0.3) 60%, transparent 100%)" }}
                  aria-hidden
                />
                {/* テキスト */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs sm:text-sm font-bold leading-snug">
                    {p.text}
                  </p>
                </div>
                {/* チェックアイコン */}
                <div
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(45,125,210,0.8)" }}
                  aria-hidden
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </ul>

        <AnimateOnScroll variant="fade" delay={200}>
          <p className="text-center mt-8 text-(--tkn-text-muted) text-sm">
            一つでも当てはまる方は、お気軽にご相談ください。
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
