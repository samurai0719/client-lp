import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import PageHero from "@/components/takanaga/common/PageHero";
import CTASection from "@/components/takanaga/common/CTASection";
import { serviceAreas } from "@/data/takanaga/areas";
import { siteConfig } from "@/data/takanaga/siteConfig";

export const metadata: Metadata = {
  title: "対応地域｜岐阜・愛知・三重の外構工事",
  description:
    "高長建設の対応地域。岐阜県・愛知県・三重県の東海エリアを中心に外構リフォームに対応しています。",
  alternates: { canonical: `https://${siteConfig.domain}/area` },
};

export default function AreaPage() {
  return (
    <>
      <PageHero
        eyebrow="Service Area"
        title="外構工事の対応地域"
        subtitle="高長建設の外構工事は、岐阜県・愛知県・三重県の東海3県に対応しています。岐阜市・各務原市をはじめとした岐阜県内を中心に、愛知県・三重県の各エリアまで、現地調査からお見積もり・施工まで一貫して対応します。対応可否が気になる地域はお気軽にお問い合わせください。"
        path="/area"
        breadcrumbs={[{ label: "対応地域" }]}
      />

      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-(--tkn-bg)">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {serviceAreas.map((area) => (
              <div key={area.prefecture} className="tkn-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-md bg-(--tkn-blue-light) flex items-center justify-center">
                    <MapPin size={18} className="text-(--tkn-blue)" aria-hidden />
                  </div>
                  <h2 className="text-lg font-bold text-(--tkn-navy-deep)">{area.prefecture}</h2>
                </div>
                {area.note && (
                  <p className="text-xs text-(--tkn-text-muted) mb-3">{area.note}</p>
                )}
                <ul className="flex flex-wrap gap-2">
                  {area.cities.map((city) => (
                    <li
                      key={city}
                      className="text-sm bg-(--tkn-warm-gray) text-(--tkn-text) px-3 py-1.5 rounded border border-(--tkn-border)"
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="p-6 bg-(--tkn-blue-light) rounded-xl">
            <h2 className="text-base font-bold text-(--tkn-navy-deep) mb-2">
              上記以外のエリアについて
            </h2>
            <p className="text-sm text-(--tkn-text) leading-relaxed">
              掲載していない市区町村でも、対応できる場合があります。
              まずはお問い合わせフォームまたはお電話でご相談ください。
            </p>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
