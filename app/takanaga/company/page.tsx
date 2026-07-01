import type { Metadata } from "next";
import PageHero from "@/components/takanaga/common/PageHero";
import CTASection from "@/components/takanaga/common/CTASection";
import { siteConfig } from "@/data/takanaga/siteConfig";

export const metadata: Metadata = {
  title: "会社案内",
  description: "高長建設の会社案内。岐阜・愛知・三重の外構工事を専門とする高長建設の事業内容・対応地域・施工方針をご紹介します。",
  alternates: { canonical: `https://${siteConfig.domain}/company` },
};

const { company, seo } = siteConfig;

type Row = { label: string; value: string | null };

const companyRows: Row[] = [
  { label: "屋号・会社名", value: siteConfig.siteName },
  { label: "代表者名", value: company.representativeName },
  { label: "設立・創業", value: company.founded ?? company.established },
  { label: "事業内容", value: company.businessType },
  { label: "所在地", value: company.address },
  { label: "電話番号", value: company.phone },
  { label: "メールアドレス", value: company.email },
  { label: "営業時間", value: company.businessHours },
  { label: "定休日", value: company.closedDays },
  { label: "対応地域", value: seo.serviceArea.join("・") },
  { label: "建設業許可", value: company.constructionLicenseNumber },
  { label: "適格請求書発行事業者登録番号", value: company.invoiceRegistrationNumber },
];

const displayRows = companyRows.filter((r) => r.value !== null);

export default function CompanyPage() {
  return (
    <>
      <PageHero
        eyebrow="Company"
        title="会社案内"
        subtitle="高長建設について"
        breadcrumbs={[{ label: "会社案内" }]}
      />

      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-(--tkn-bg)">
        <div className="mx-auto max-w-4xl space-y-12">
          {/* 代表挨拶プレースホルダー */}
          <div className="tkn-card p-6 sm:p-8">
            <h2 className="text-xl font-bold text-(--tkn-navy-deep) mb-4">代表挨拶</h2>
            <div className="text-sm text-(--tkn-text-muted) italic">
              ※ 代表者の挨拶文が確定しましたら、こちらに掲載します。
            </div>
          </div>

          {/* 会社概要 */}
          {displayRows.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-(--tkn-navy-deep) mb-6">会社概要</h2>
              <div className="tkn-card overflow-hidden">
                <dl>
                  {displayRows.map((row, i) => (
                    <div
                      key={row.label}
                      className={`flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 px-5 py-4 ${
                        i % 2 === 0 ? "bg-white" : "bg-(--tkn-warm-gray)"
                      } border-b border-(--tkn-border) last:border-b-0`}
                    >
                      <dt className="sm:w-40 shrink-0 text-sm font-semibold text-(--tkn-text-muted)">
                        {row.label}
                      </dt>
                      <dd className="text-sm text-(--tkn-text)">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}

          {/* 地図プレースホルダー */}
          {company.googleMapsEmbedUrl ? (
            <div>
              <h2 className="text-xl font-bold text-(--tkn-navy-deep) mb-4">アクセスマップ</h2>
              <div className="rounded-xl overflow-hidden aspect-[16/9]">
                <iframe
                  src={company.googleMapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="高長建設 所在地マップ"
                />
              </div>
            </div>
          ) : (
            <div className="tkn-card p-6">
              <h2 className="text-xl font-bold text-(--tkn-navy-deep) mb-2">アクセスマップ</h2>
              <p className="text-sm text-(--tkn-text-muted) italic">
                ※ 住所が確定しましたら、Googleマップを表示します。
              </p>
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}
