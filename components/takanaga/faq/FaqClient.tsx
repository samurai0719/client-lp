"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { faqs, type FaqItem } from "@/data/takanaga/faqs";

const CATEGORIES = ["すべて", "費用", "工事", "対応エリア", "手続き", "アフター"] as const;

function FaqAccordion({ faq, isOpen, onToggle }: { faq: FaqItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="tkn-accordion">
      <button
        type="button"
        className="tkn-accordion-trigger"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faq.id}`}
        id={`faq-trigger-${faq.id}`}
        onClick={onToggle}
      >
        <span className="flex items-start gap-3">
          <span className="shrink-0 w-6 h-6 rounded-full bg-(--tkn-blue-light) text-(--tkn-blue) flex items-center justify-center text-xs font-bold mt-0.5" aria-hidden>Q</span>
          {faq.question}
        </span>
        <ChevronDown size={18} className={`shrink-0 text-(--tkn-text-muted) transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {isOpen && (
        <div id={`faq-answer-${faq.id}`} role="region" aria-labelledby={`faq-trigger-${faq.id}`} className="tkn-accordion-content">
          <div className="flex items-start gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-(--tkn-blue) text-white flex items-center justify-center text-xs font-bold mt-0.5" aria-hidden>A</span>
            <p>{faq.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FaqClient() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [selectedCat, setSelectedCat] = useState<string>("すべて");

  const filtered = faqs.filter(
    (f) => selectedCat === "すべて" || f.category === selectedCat
  );

  return (
    <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-(--tkn-bg)">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`text-sm px-4 py-2 rounded-full font-semibold border transition-colors ${
                selectedCat === cat
                  ? "bg-(--tkn-blue) text-white border-(--tkn-blue)"
                  : "bg-white text-(--tkn-text-muted) border-(--tkn-border) hover:border-(--tkn-blue-bright)"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div role="list">
          {filtered.map((faq) => (
            <div role="listitem" key={faq.id}>
              <FaqAccordion
                faq={faq}
                isOpen={openId === faq.id}
                onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
              />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-(--tkn-text-muted) py-8">
            このカテゴリーの質問はありません。
          </p>
        )}

        <div className="mt-10 p-6 bg-(--tkn-blue-light) rounded-xl text-center">
          <p className="text-base font-bold text-(--tkn-navy-deep) mb-2">
            ご不明な点はお気軽にお問い合わせください
          </p>
          <p className="text-sm text-(--tkn-text-muted) mb-5">
            FAQに載っていない内容でも、お気軽にご質問ください。
          </p>
          <Link href="/contact" className="tkn-btn-primary">
            お問い合わせ
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
