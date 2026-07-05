import Link from "next/link";
import { ChevronRight } from "lucide-react";

// トップページの主要ページ案内メニュー。
// Googleが重要ページを認識しやすいよう、検索結果のサイトリンクに近い
// 「ページ名＋短い説明」のグリッドを通常のaタグ（Link）で並べる。
const GUIDE_ITEMS = [
  {
    href: "/services",
    title: "事業案内",
    description: "高長建設が対応している外構工事をご紹介",
  },
  {
    href: "/works",
    title: "施工事例",
    description: "駐車場・カーポート・庭リフォームなどの施工実績",
  },
  {
    href: "/company",
    title: "会社案内",
    description: "高長建設の会社情報・代表挨拶",
  },
  {
    href: "/area",
    title: "対応地域",
    description: "岐阜県・愛知県・三重県の対応エリア",
  },
  {
    href: "/pricing",
    title: "料金・費用目安",
    description: "外構工事の費用や料金例",
  },
  {
    href: "/faq",
    title: "よくある質問",
    description: "現地調査や見積もり、工事についての質問",
  },
  {
    href: "/contact",
    title: "お問い合わせ",
    description: "無料現地調査・無料見積もりはこちら",
  },
];

export default function SiteGuideSection() {
  return (
    <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-(--tkn-warm-gray)" aria-label="サイト案内">
      <div className="mx-auto max-w-7xl">
        <p className="tkn-eyebrow mb-3">Site Guide</p>
        <h2 className="text-xl sm:text-2xl font-bold text-(--tkn-navy-deep) mb-8">
          高長建設のご案内
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {GUIDE_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex items-center justify-between gap-3 h-full rounded-xl border border-(--tkn-border) bg-white px-5 py-4 hover:border-(--tkn-blue-bright) hover:shadow-sm transition-all"
              >
                <span>
                  <span className="block text-[15px] font-bold text-(--tkn-navy-deep) group-hover:text-(--tkn-blue-bright) transition-colors">
                    {item.title}
                  </span>
                  <span className="block mt-1 text-xs text-(--tkn-text-muted) leading-relaxed">
                    {item.description}
                  </span>
                </span>
                <ChevronRight
                  size={16}
                  className="shrink-0 text-(--tkn-blue-bright) group-hover:translate-x-0.5 transition-transform"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
