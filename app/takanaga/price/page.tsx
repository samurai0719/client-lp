import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Banknote, CircleDollarSign, CircleCheckBig, Landmark, ShieldCheck } from "lucide-react";
import PageHero from "@/components/takanaga/common/PageHero";
import CTASection from "@/components/takanaga/common/CTASection";
import { visiblePriceItems, costFactors } from "@/data/takanaga/prices";
import { siteConfig } from "@/data/takanaga/siteConfig";

// お支払い方法：現金（着工前20%・完了後80%の分割払い）。銀行振込・リフォームローンにも対応。
// components/gaikou/data.ts の paymentInfoItems と内容を揃える（表記の統一）。
const paymentInfo = [
  { icon: Banknote, title: "現金でのお支払いに対応", body: "現金でのお支払いをお受けしています。銀行振込でのお支払いも可能です。" },
  { icon: CircleDollarSign, title: "着工前：工事代金の20%", body: "ご契約後、着工前に工事代金の20%をお支払いいただきます。" },
  { icon: CircleCheckBig, title: "完了後：残り80%", body: "施工完了・仕上がりのご確認後に、残りの80%をお支払いいただきます。" },
  { icon: Landmark, title: "リフォームローンのご相談も可能", body: "銀行のリフォームローンをご希望の場合もご相談いただけます。詳しくはお問い合わせください。" },
];

// 保証期間の目安（外構工事業界で一般的な水準：構造物2年・植栽の枯れ保証半年）。
// 実際の年数は根拠のある業界水準に基づく（コンクリート土間・ブロック塀・フェンス等）。
const warrantyInfo = [
  { title: "施工箇所（コンクリート・ブロック塀・フェンス・門柱など）", period: "2年保証" },
  { title: "芝生・植栽", period: "半年（枯れ保証）" },
  { title: "カーポート等の既製品", period: "各メーカーの保証に準じます" },
];

export const metadata: Metadata = {
  title: "外構工事の料金・費用目安",
  description:
    "高長建設の外構リフォーム費用目安。工事別参考価格と、費用に影響する要因をご紹介します。正確な費用は現地調査後にご案内します。",
  alternates: { canonical: `https://${siteConfig.domain}/pricing` },
};

export default function PricePage() {
  return (
    <>
      <PageHero
        eyebrow="Price"
        title="外構工事の料金・費用目安"
        subtitle="高長建設の外構工事の料金・費用目安をご紹介します。駐車場コンクリート、カーポート、フェンス、人工芝・防草対策など工事別の参考価格と、費用が変動する主な要因をまとめました。正確な金額は無料の現地調査後にお見積もりでご案内します。"
        path="/pricing"
        breadcrumbs={[{ label: "料金・費用目安" }]}
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
                      <td className="px-5 py-4 text-(--tkn-navy-deep) font-medium min-w-0 w-full">
                        {item.workType}
                        {item.priceNote && (
                          <p className="text-xs text-(--tkn-text-muted) font-normal mt-1">{item.priceNote}</p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right whitespace-nowrap">
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
            <p className="text-sm text-(--tkn-text) mt-4 leading-relaxed">
              駐車場2台分のコンクリートと2台用カーポートを同時に施工する場合は、100万円前後からが目安です。
            </p>
            <p className="text-xs text-(--tkn-text-muted) mt-2 leading-relaxed">
              ※表示価格は標準的な施工条件での目安です。施工面積、既存外構の撤去、地盤状況、残土処分、排水工事、使用商品によって価格は変動します。正式な金額は現地調査後にお見積もりします。
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

          {/* お支払い方法 */}
          <div>
            <h2 className="text-xl font-bold text-(--tkn-navy-deep) mb-2">お支払い方法</h2>
            <p className="text-sm text-(--tkn-text-muted) mb-6 leading-relaxed">
              現金でのお支払いに対応しています。着工前に工事代金の20%、施工完了後に残り80%をお支払いいただく分割払いです。
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {paymentInfo.map((item) => (
                <li key={item.title} className="tkn-card p-4 sm:p-5">
                  <item.icon size={20} className="text-(--tkn-blue) mb-2" aria-hidden />
                  <p className="text-sm font-bold text-(--tkn-navy-deep)">{item.title}</p>
                  <p className="mt-1 text-xs text-(--tkn-text-muted) leading-relaxed">{item.body}</p>
                </li>
              ))}
            </ul>
            <p className="text-xs text-(--tkn-text-muted) mt-4 leading-relaxed">
              ※お支払い時期・方法の詳細はご契約時にご説明します。銀行のリフォームローンをご希望の場合もご相談ください。
            </p>
          </div>

          {/* 保証期間 */}
          <div>
            <h2 className="text-xl font-bold text-(--tkn-navy-deep) mb-2 flex items-center gap-2">
              <ShieldCheck size={22} className="text-(--tkn-blue)" aria-hidden />
              保証期間の目安
            </h2>
            <p className="text-sm text-(--tkn-text-muted) mb-6 leading-relaxed">
              工事後の不具合については、状況を確認のうえ対応しています。保証期間の目安は以下のとおりです。
            </p>
            <div className="tkn-card overflow-hidden">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-(--tkn-border)">
                  {warrantyInfo.map((item) => (
                    <tr key={item.title}>
                      <td className="px-5 py-4 text-(--tkn-navy-deep) font-medium">{item.title}</td>
                      <td className="px-5 py-4 text-right whitespace-nowrap text-(--tkn-blue) font-bold">{item.period}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-(--tkn-text-muted) mt-4 leading-relaxed">
              ※自然災害・経年劣化・お客様による破損・当社以外の工事による不具合は対象外となる場合があります。使用商品によって保証内容が異なる場合は、お見積もり時にご説明します。
            </p>
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
            <Link href="/contact" className="tkn-btn-primary">
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
