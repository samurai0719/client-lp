import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { publishedWorks } from "@/data/takanaga/works";
import AnimateOnScroll from "@/components/takanaga/common/AnimateOnScroll";

const DISPLAY_COUNT = 6;

export default function WorksSection() {
  const displayWorks = publishedWorks.slice(0, DISPLAY_COUNT);

  return (
    <section
      className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-(--tkn-warm-gray) tkn-section-alt"
      aria-labelledby="works-heading"
    >
      <div className="mx-auto max-w-6xl">
        <AnimateOnScroll variant="up" className="text-center mb-10">
          <p className="tkn-eyebrow justify-center mb-3">Works</p>
          <h2
            id="works-heading"
            className="text-2xl sm:text-3xl font-bold text-(--tkn-navy-deep) leading-tight"
          >
            施工事例
          </h2>
          <span className="tkn-heading-line mx-auto mt-3 mb-4" />
          <p className="text-(--tkn-text-muted) text-sm sm:text-base max-w-xl mx-auto">
            実際の施工事例をBefore・Afterでご確認いただけます。
          </p>
        </AnimateOnScroll>

        {displayWorks.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayWorks.map((work, i) => (
              <AnimateOnScroll key={work.slug} variant="up" delay={i * 80} as="li">
                <Link
                  href={`/works/${work.slug}`}
                  className="group block tkn-card overflow-hidden hover:border-(--tkn-blue-bright)"
                >
                  {/* Before/After 画像 */}
                  <div className="grid grid-cols-2 divide-x divide-(--tkn-border)">
                    <div className="relative aspect-[4/3] bg-(--tkn-warm-gray)">
                      <Image
                        src={work.beforeImage}
                        alt={`${work.title} Before`}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 35vw, 48vw"
                      />
                      <span className="absolute top-2 left-2 text-[0.625rem] font-bold bg-black/60 text-white px-2 py-0.5 rounded">
                        Before
                      </span>
                    </div>
                    <div className="relative aspect-[4/3] bg-(--tkn-warm-gray)">
                      <Image
                        src={work.afterImage}
                        alt={`${work.title} After`}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 35vw, 48vw"
                      />
                      <span
                        className="absolute top-2 left-2 text-[0.625rem] font-bold text-white px-2 py-0.5 rounded"
                        style={{ background: "rgba(29,95,166,0.85)" }}
                      >
                        After
                      </span>
                    </div>
                  </div>

                  {/* カード情報 */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[0.625rem] font-bold text-(--tkn-blue) bg-(--tkn-blue-light) px-2 py-0.5 rounded">
                        {work.category}
                      </span>
                      <span className="text-xs text-(--tkn-text-muted)">{work.city}</span>
                    </div>
                    <h3 className="text-sm font-bold text-(--tkn-navy-deep) leading-snug mb-2 group-hover:text-(--tkn-blue-bright) transition-colors">
                      {work.title}
                    </h3>
                    <p className="text-xs text-(--tkn-text-muted) leading-relaxed line-clamp-2">
                      {work.customerConcern}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-(--tkn-blue-bright) group-hover:gap-2 transition-all">
                      詳細を見る
                      <ArrowRight size={12} aria-hidden />
                    </div>
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
          </ul>
        ) : (
          <p className="text-center text-(--tkn-text-muted) py-12">
            施工事例は準備中です。
          </p>
        )}

        <AnimateOnScroll variant="fade" delay={100} className="text-center mt-8">
          <Link
            href="/works"
            className="inline-flex items-center gap-2 text-sm font-semibold text-(--tkn-blue-bright) hover:text-(--tkn-navy) transition-colors"
          >
            施工事例をすべて見る
            <ArrowRight size={16} aria-hidden />
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
