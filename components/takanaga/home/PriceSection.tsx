import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { visiblePriceItems, costFactors } from "@/data/takanaga/prices";
import AnimateOnScroll from "@/components/takanaga/common/AnimateOnScroll";

export default function PriceSection() {
  return (
    <section
      className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-(--tkn-warm-gray) tkn-section-alt"
      aria-labelledby="price-heading"
    >
      <div className="mx-auto max-w-5xl">
        <AnimateOnScroll variant="up" className="text-center mb-10">
          <p className="tkn-eyebrow justify-center mb-3">Price</p>
          <h2
            id="price-heading"
            className="text-2xl sm:text-3xl font-bold text-(--tkn-navy-deep) leading-tight"
          >
            費用目安
          </h2>
          <span className="tkn-heading-line mx-auto mt-3 mb-4" />
          <p className="text-(--tkn-text-muted) text-sm sm:text-base max-w-2xl mx-auto">
            外構工事の費用は、現地の状況や工事内容によって大きく変わります。
            正確な費用は現地調査後にご案内します。
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 参考価格テーブル */}
          <AnimateOnScroll variant="right">
            <div className="tkn-card overflow-hidden">
              <div
                className="px-5 py-3"
                style={{ background: "linear-gradient(90deg, #1a3d6b, #1d5fa6)" }}
              >
                <h3 className="text-sm font-bold text-white">工事別 参考価格</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-(--tkn-sky)">
                    <th className="text-left px-4 py-2 font-semibold text-(--tkn-text-muted) text-xs">
                      工事内容
                    </th>
                    <th className="text-right px-4 py-2 font-semibold text-(--tkn-text-muted) text-xs">
                      目安価格
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--tkn-border)">
                  {visiblePriceItems.map((item) => (
                    <tr key={item.id} className="hover:bg-(--tkn-sky)/60 transition-colors">
                      <td className="px-4 py-3 text-(--tkn-navy-deep) font-medium min-w-0 w-full">
                        {item.workType}
                        {item.priceNote && (
                          <p className="text-xs text-(--tkn-text-muted) font-normal mt-0.5">
                            {item.priceNote}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {item.priceLabel ? (
                          <span className="font-bold text-(--tkn-blue)">{item.priceLabel}</span>
                        ) : (
                          <span className="text-xs text-(--tkn-text-muted)">現地調査後にご案内</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="px-4 py-3 text-xs text-(--tkn-text-muted) bg-(--tkn-sky) border-t border-(--tkn-border)">
                ※ 上記は参考価格です。現地の状況により変わります。
              </p>
            </div>
          </AnimateOnScroll>

          {/* 費用に影響する要因 */}
          <AnimateOnScroll variant="up" delay={100}>
            <div>
              <h3 className="text-base font-bold text-(--tkn-navy-deep) mb-4">
                費用が変わる主な要因
              </h3>
              <ul className="space-y-2.5">
                {costFactors.map((factor, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-(--tkn-text)">
                    <span
                      className="shrink-0 w-5 h-5 rounded-full text-white flex items-center justify-center text-xs font-bold mt-0.5"
                      style={{ background: "var(--tkn-blue)" }}
                      aria-hidden
                    >
                      {i + 1}
                    </span>
                    {factor}
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-4 bg-(--tkn-blue-light) rounded-lg text-sm text-(--tkn-navy-deep) leading-relaxed border border-(--tkn-border)">
                現地をしっかり確認した上で、分かりやすいお見積もりを作成します。
                費用についての疑問もお気軽にご質問ください。
              </div>
            </div>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll variant="fade" delay={100} className="text-center mt-8">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm font-semibold text-(--tkn-blue-bright) hover:text-(--tkn-navy) transition-colors"
          >
            費用目安の詳細を見る
            <ArrowRight size={16} aria-hidden />
          </Link>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
