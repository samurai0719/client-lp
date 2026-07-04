import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

export default function Breadcrumb({ items }: Props) {
  const all = [{ label: "ホーム", href: "/" }, ...items];

  return (
    <nav aria-label="パンくずリスト" className="py-3 px-4 sm:px-6 lg:px-8 bg-(--tkn-warm-gray)">
      <ol
        className="mx-auto max-w-7xl flex flex-wrap items-center gap-1 text-xs text-(--tkn-text-muted)"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {all.map((item, i) => (
          <li
            key={i}
            className="flex items-center gap-1"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {i > 0 && <ChevronRight size={12} aria-hidden className="shrink-0" />}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-(--tkn-blue-bright) transition-colors"
                itemProp="item"
              >
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span className="text-(--tkn-text)" itemProp="name" aria-current="page">
                {item.label}
              </span>
            )}
            <meta itemProp="position" content={String(i + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}
