"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Filter } from "lucide-react";
import { publishedWorks, type WorkCategory } from "@/data/takanaga/works";

const CATEGORIES: (WorkCategory | "すべて")[] = [
  "すべて",
  "駐車場・土間コンクリート",
  "カーポート・ガレージ",
  "フェンス・目隠し",
  "玄関アプローチ",
  "人工芝・防草対策",
  "ウッドデッキ・テラス",
  "庭リフォーム",
  "外構全体のリフォーム",
];

const PREFECTURES = ["すべて", "岐阜県", "愛知県", "三重県"] as const;

export default function WorksClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("すべて");
  const [selectedPref, setSelectedPref] = useState<string>("すべて");

  const filtered = useMemo(() => {
    return publishedWorks.filter((w) => {
      const catOk = selectedCategory === "すべて" || w.category === selectedCategory;
      const prefOk = selectedPref === "すべて" || w.prefecture === selectedPref;
      return catOk && prefOk;
    });
  }, [selectedCategory, selectedPref]);

  return (
    <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-(--tkn-bg)">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-(--tkn-text-muted)" aria-hidden />
            <span className="text-xs font-semibold text-(--tkn-text-muted) mr-1">工事カテゴリー</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-colors ${
                  selectedCategory === cat
                    ? "bg-(--tkn-blue) text-white border-(--tkn-blue)"
                    : "bg-white text-(--tkn-text-muted) border-(--tkn-border) hover:border-(--tkn-blue-bright)"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-(--tkn-text-muted) mr-1">都道府県</span>
            {PREFECTURES.map((pref) => (
              <button
                key={pref}
                type="button"
                onClick={() => setSelectedPref(pref)}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-colors ${
                  selectedPref === pref
                    ? "bg-(--tkn-blue) text-white border-(--tkn-blue)"
                    : "bg-white text-(--tkn-text-muted) border-(--tkn-border) hover:border-(--tkn-blue-bright)"
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-(--tkn-text-muted) mb-6">
          {filtered.length}件の施工事例
        </p>

        {filtered.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((work) => (
              <li key={work.slug}>
                <Link
                  href={`/works/${work.slug}`}
                  className="group block tkn-card hover:border-(--tkn-blue-bright) transition-colors overflow-hidden h-full"
                >
                  <div className="grid grid-cols-2 divide-x divide-(--tkn-border)">
                    <div className="relative aspect-[4/3] bg-(--tkn-warm-gray)">
                      <Image
                        src={work.beforeImage}
                        alt={`${work.title} Before`}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                      />
                      <span className="absolute top-2 left-2 text-[0.625rem] font-bold bg-black/60 text-white px-2 py-0.5 rounded">
                        Before
                      </span>
                    </div>
                    <div className="relative aspect-[4/3] bg-(--tkn-warm-gray)">
                      <Image
                        src={work.afterImage}
                        alt={`${work.title} After`}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                      />
                      <span className="absolute top-2 left-2 text-[0.625rem] font-bold bg-(--tkn-blue)/80 text-white px-2 py-0.5 rounded">
                        After
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[0.625rem] font-bold text-(--tkn-blue-bright) bg-(--tkn-blue-light) px-2 py-0.5 rounded">
                        {work.category}
                      </span>
                      <span className="text-xs text-(--tkn-text-muted)">{work.city}</span>
                    </div>
                    <h2 className="text-sm font-bold text-(--tkn-navy-deep) leading-snug mb-2 group-hover:text-(--tkn-blue-bright) transition-colors">
                      {work.title}
                    </h2>
                    <p className="text-xs text-(--tkn-text-muted) leading-relaxed line-clamp-2">
                      {work.customerConcern}
                    </p>
                    <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-(--tkn-blue-bright) group-hover:gap-2 transition-all">
                      詳細を見る
                      <ArrowRight size={12} aria-hidden />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-16 text-(--tkn-text-muted)">
            <p className="text-base">条件に一致する施工事例がありません。</p>
            <button
              type="button"
              className="mt-4 text-sm text-(--tkn-blue-bright) underline"
              onClick={() => { setSelectedCategory("すべて"); setSelectedPref("すべて"); }}
            >
              フィルターをリセットする
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
