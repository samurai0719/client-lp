import Breadcrumb, { type BreadcrumbItem } from "./Breadcrumb";
import { siteConfig } from "@/data/takanaga/siteConfig";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  /** 公開URLのパス（例: "/services"）。指定するとWebPageのJSON-LDを出力する */
  path?: string;
  /** WebPage JSON-LD用の説明文（省略時はsubtitleを使用） */
  description?: string;
};

export default function PageHero({ eyebrow, title, subtitle, breadcrumbs, path, description }: Props) {
  const webPageJsonLd = path
    ? {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${siteConfig.siteUrl}${path}#webpage`,
        url: `${siteConfig.siteUrl}${path}`,
        name: title,
        description: description ?? subtitle ?? undefined,
        inLanguage: "ja",
        isPartOf: { "@id": `${siteConfig.siteUrl}/#website` },
      }
    : null;

  return (
    <>
      {webPageJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
        />
      )}
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      <div className="tkn-page-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {eyebrow && (
            <p className="tkn-eyebrow !text-(--tkn-blue-light) mb-3">{eyebrow}</p>
          )}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-white/75 text-sm sm:text-base leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
