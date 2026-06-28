import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/takanaga/common/PageHero";
import CTASection from "@/components/takanaga/common/CTASection";
import { visiblePriceItems, costFactors } from "@/data/takanaga/prices";
import { siteConfig } from "@/data/takanaga/siteConfig";

export const metadata: Metadata = {
  title: "費用目安",
  description:
    "高長建設の外構リフォーム費用目安。工事別参考価格と、費用に影響する要因をご紹介します。正確な費用は現地調査後にご案内します。",
  alternates: { canonical: `https://${siteConfig.domain}/takanaga/price` },
};

export default function PricePage() {
  return (
    <>
      <PageHero
        eyebrow="Price"
        title="費用目安"
        subtitle="外構工事の費用は現地の状況によって変わります。下記を参考にしていただき、詳しくはお気軽にお問い合わせください。"
        breadcrumbs={[{ label: "費用目安" }]}
      />

      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-(--tkn-bg)">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* 参考価格テーブル */}
          <div>
            <h2 className="text-xl font-bold text-(--tkn-navy-deep) mb-6">工事別 参考価格</h2>
            <div className="tkn-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-(--tkn-blue)">
                    <th className="text-left px-5 py-3 font-semibold text-white text-sm">工事内容</th>
                    <th className="text-right px-5 py-3 font-semibold text-white text-sm">目安価格（税込）</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--tkn-border)">
                  {visiblePriceItems.map((item) => (
                    <tr key={item.id} className="hover:bg-(--tkn-warm-gray)/50 transition-colors">
                      <td className="px-5 py-4 text-(--tkn-navy-deep) font-medium">
                        {item.workType}
                        {item.priceNote && (
                          <p className="text-xs text-(--tkn-text-muted) font-normal mt-1">{item.priceNote}</p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {item.priceLabel ? (
                          <span className="text-base font-bold text-(--tkn-blue)">{item.priceLabel}</span>
                        ) : (
                          <span className="text-xs text-(--tkn-text-muted)">現地調査後にご案内</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-(--tkn-text-muted) mt-3">
              ※ 上記の金額は参考価格です。現地の状況・仕様・施工条件によって変わります。正確な費用は現地調査後にご案内します。
            </p>
          </div>

          {/* 費用に影響する要因 */}
          <div>
            <h2 className="text-xl font-bold text-(--tkn-navy-deep) mb-6">費用が変わる主な要因</h2>
            <p className="text-sm text-(--tkn-text-muted) mb-6 leading-relaxed">
              外構工事は、以下のような条件によって費用が大きく変わります。
              見積もりを依頼する前に、ご自宅の状況を確認しておくとスムーズです。
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {costFactors.map((factor, i) => (
                <li key={i} className="flex items-start gap-3 bg-white border border-(--tkn-border) rounded-lg px-4 py-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-(--tkn-blue-light) text-(--tkn-blue) flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-sm text-(--tkn-text)">{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 費用について */}
          <div className="p-6 sm:p-8 bg-(--tkn-blue-light) rounded-xl">
            <h2 className="text-base font-bold text-(--tkn-navy-deep) mb-3">
              費用についてのご相談
            </h2>
            <p className="text-sm text-(--tkn-text) leading-relaxed mb-5">
              「予算がいくらあればできるか」「この内容でいくらになるか」など、費用についてのご相談もお気軽にどうぞ。
              現地を確認した上で、お客様の予算に合ったプランをご提案します。
            </p>
            <Link href="/takanaga/contact" className="tkn-btn-primary">
              費用について相談する
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
