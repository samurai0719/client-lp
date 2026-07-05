import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteConfig } from "@/data/takanaga/siteConfig";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

// 画面表示のパンくず＋BreadcrumbListのJSON-LDを出力する。
// （旧実装のmicrodataはJSON-LDへ一本化し、二重マークアップを避ける）
export default function Breadcrumb({ items }: Props) {
  const all = [{ label: "ホーム", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      // 最終要素（現在ページ）はitem省略可のため、hrefがある項目のみURLを付与
      ...(item.href ? { item: `${siteConfig.siteUrl}${item.href === "/" ? "/" : item.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="パンくずリスト" className="py-3 px-4 sm:px-6 lg:px-8 bg-(--tkn-warm-gray)">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="mx-auto max-w-7xl flex flex-wrap items-center gap-1 text-xs text-(--tkn-text-muted)">
        {all.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={12} aria-hidden className="shrink-0" />}
            {item.href ? (
              <Link href={item.href} className="hover:text-(--tkn-blue-bright) transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-(--tkn-text)" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
