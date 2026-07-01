import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Phone, ExternalLink } from "lucide-react";
import PageHero from "@/components/takanaga/common/PageHero";
import CTASection from "@/components/takanaga/common/CTASection";
import { siteConfig } from "@/data/takanaga/siteConfig";

export const metadata: Metadata = {
  title: "会社案内",
  description: "高長建設の会社案内。岐阜県各務原市を拠点に岐阜・愛知・三重の外構工事を手がける高長建設の事業内容・代表者・所在地をご紹介します。",
  alternates: { canonical: `https://${siteConfig.domain}/company` },
};

const { company, seo } = siteConfig;

type Row = { label: string; value: string | null; href?: string };

const companyRows: Row[] = [
  { label: "屋号・会社名", value: siteConfig.siteName },
  { label: "代表者名", value: company.representativeName },
  { label: "設立・創業", value: company.founded ?? company.established },
  { label: "事業内容", value: company.businessType },
  {
    label: "所在地",
    value: company.postalCode && company.address
      ? `〒${company.postalCode} ${company.address}`
      : company.address,
    href: company.googleMapsUrl ?? undefined,
  },
  { label: "電話番号", value: company.phone, href: company.phone ? `tel:${company.phone}` : undefined },
  { label: "メールアドレス", value: company.email, href: company.email ? `mailto:${company.email}` : undefined },
  { label: "営業時間", value: company.businessHours },
  { label: "定休日", value: company.closedDays },
  { label: "対応地域", value: seo.serviceArea.join("・") },
  { label: "建設業許可", value: company.constructionLicenseNumber },
  { label: "適格請求書発行事業者登録番号", value: company.invoiceRegistrationNumber },
];

const displayRows = companyRows.filter((r) => r.value !== null);

export default function CompanyPage() {
  const siteUrl = `https://${siteConfig.domain}`;

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#organization`,
    name: siteConfig.siteName,
    description: siteConfig.description,
    url: siteUrl,
    telephone: company.phone,
    ...(company.address
      ? {
          address: {
            "@type": "PostalAddress",
            postalCode: company.postalCode,
            addressRegion: "岐阜県",
            addressLocality: "各務原市",
            streetAddress: "那加桐野町1-65",
            addressCountry: "JP",
          },
        }
      : {}),
    ...(company.googleMapsUrl ? { hasMap: company.googleMapsUrl } : {}),
    ...(company.representativeName
      ? { employee: { "@type": "Person", name: company.representativeName, jobTitle: "代表" } }
      : {}),
    areaServed: seo.serviceArea.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />

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
                      className={`flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-5 py-4 ${
                        i % 2 === 0 ? "bg-white" : "bg-(--tkn-warm-gray)"
                      } border-b border-(--tkn-border) last:border-b-0`}
                    >
                      <dt className="sm:w-44 shrink-0 text-sm font-semibold text-(--tkn-text-muted)">
                        {row.label}
                      </dt>
                      <dd className="text-sm text-(--tkn-text)">
                        {row.href ? (
                          <a
                            href={row.href}
                            target={row.href.startsWith("http") ? "_blank" : undefined}
                            rel={row.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="inline-flex items-center gap-1 text-(--tkn-blue-bright) hover:underline"
                          >
                            {row.label === "所在地" && <MapPin size={14} aria-hidden />}
                            {row.label === "電話番号" && <Phone size={14} aria-hidden />}
                            {row.value}
                            {row.href.startsWith("http") && <ExternalLink size={12} aria-hidden />}
                          </a>
                        ) : (
                          row.value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}

          {/* アクセスマップ */}
          <div>
            <h2 className="text-xl font-bold text-(--tkn-navy-deep) mb-4">アクセスマップ</h2>

            {company.googleMapsEmbedUrl ? (
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
            ) : (
              <div className="rounded-xl overflow-hidden bg-(--tkn-warm-gray) aspect-[16/9] flex flex-col items-center justify-center gap-4">
                <MapPin size={32} className="text-(--tkn-blue)" aria-hidden />
                <div className="text-center">
                  <p className="text-sm font-semibold text-(--tkn-navy-deep) mb-1">
                    〒{company.postalCode} {company.address}
                  </p>
                  {company.googleMapsUrl && (
                    <Link
                      href={company.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-(--tkn-blue-bright) hover:underline mt-2"
                    >
                      <ExternalLink size={14} aria-hidden />
                      Googleマップで確認する
                    </Link>
                  )}
                </div>
                <p className="text-xs text-(--tkn-text-muted)">
                  ※ 地図を表示するには管理者がiframe URLを設定してください
                </p>
              </div>
            )}

            {/* マップが表示されている場合もGoogleマップリンクを表示 */}
            {company.googleMapsEmbedUrl && company.googleMapsUrl && (
              <div className="mt-3 text-right">
                <Link
                  href={company.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-(--tkn-blue-bright) hover:underline"
                >
                  <ExternalLink size={14} aria-hidden />
                  Googleマップで開く
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
