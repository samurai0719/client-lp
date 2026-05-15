"use client";

import { useState } from "react";

const ORANGE = "#f97316";
const ORANGE_DARK = "#c25a0a";

const faqs = [
  {
    q: "転職活動中であることは、今の職場に知られますか？",
    a: "個人情報は厳重に管理されており、在職中の職場に知られることはありません。応募先への情報共有も、ご本人の承諾なしには行いません。",
  },
  {
    q: "今すぐ転職するつもりはないのですが、相談だけでも大丈夫ですか？",
    a: "もちろんです。「まず求人だけ見たい」「条件を比較してから考えたい」という方も歓迎しています。転職を急かすことはありません。",
  },
  {
    q: "利用料金はかかりますか？",
    a: "求職者の方は完全無料でご利用いただけます。求人企業側から費用をいただく仕組みのため、ご負担はありません。",
  },
  {
    q: "非公開求人とはどのような求人ですか？",
    a: "一般に公開されていない非公開の求人情報です。登録後、業界専門のコンサルタントを通じてご確認いただけます。",
  },
  {
    q: "地方在住でも利用できますか？",
    a: "全国の求人に対応しています。電話・メール・オンラインでのサポートも可能ですので、お住まいの地域に関わらずご利用いただけます。",
  },
];

export default function SekouFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="rounded-2xl border overflow-hidden"
          style={{
            borderColor: openIndex === i ? ORANGE : "#e5e7eb",
            background: openIndex === i ? "rgba(249,115,22,0.04)" : "#fff",
            boxShadow:
              openIndex === i
                ? "0 2px 16px rgba(249,115,22,0.10)"
                : "0 1px 4px rgba(0,0,0,0.04)",
            transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s",
          }}
        >
          <button
            className="w-full flex items-start gap-3 px-5 py-4 text-left"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
          >
            {/* Q Badge */}
            <span
              className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full font-extrabold mt-0.5"
              style={{
                fontSize: 11,
                background:
                  openIndex === i
                    ? `linear-gradient(135deg, ${ORANGE}, #ff9a47)`
                    : "#f3f4f6",
                color: openIndex === i ? "#fff" : "#9ca3af",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              Q
            </span>

            <span className="flex-1 font-bold text-sm md:text-base text-slate-800 leading-snug">
              {faq.q}
            </span>

            {/* Chevron */}
            <svg
              className="shrink-0 mt-0.5"
              style={{
                transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                color: ORANGE,
                transition: "transform 0.2s",
              }}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Answer */}
          <div
            className="grid transition-[grid-template-rows] duration-300 ease-in-out"
            style={{ gridTemplateRows: openIndex === i ? "1fr" : "0fr" }}
          >
            <div className="overflow-hidden">
              <div
                className="px-5 pb-5 pt-3 border-t"
                style={{ borderColor: "rgba(249,115,22,0.12)" }}
              >
                <div className="flex gap-3">
                  {/* A Badge */}
                  <span
                    className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full font-extrabold mt-0.5"
                    style={{
                      fontSize: 11,
                      background: "rgba(249,115,22,0.10)",
                      color: ORANGE_DARK,
                    }}
                  >
                    A
                  </span>
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed flex-1">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
