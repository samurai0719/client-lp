"use client";

import { useState } from "react";

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
    q: "施工管理以外の職種でも対応していますか？",
    a: "施工管理に加え、設備管理・設計・CADオペレーターなど、建設・設備・プラント系の職種に幅広く対応しています。",
  },
  {
    q: "地方在住でも利用できますか？",
    a: "全国の求人に対応しています。電話・メール・オンラインでのサポートも可能ですので、お住まいの地域に関わらずご利用いただけます。",
  },
];

export default function SekouFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
        >
          <button
            className="w-full flex items-start justify-between gap-3 px-5 py-4 text-left hover:bg-slate-50 active:bg-slate-100 transition-colors duration-150 cursor-pointer"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
          >
            <span className="shrink-0 mt-0.5 w-7 h-7 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center select-none">
              {i + 1}
            </span>
            <span className="flex-1 text-sm md:text-base font-semibold text-slate-800 leading-relaxed text-left">
              {faq.q}
            </span>
            <span
              className={`shrink-0 mt-1 transition-transform duration-200 ${
                openIndex === i ? "rotate-180 text-orange-500" : "text-slate-400"
              }`}
            >
              <svg
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
            </span>
          </button>

          <div
            className="grid transition-[grid-template-rows] duration-300 ease-in-out"
            style={{ gridTemplateRows: openIndex === i ? "1fr" : "0fr" }}
          >
            <div className="overflow-hidden">
              <div className="px-5 pb-5 pt-3 border-t border-slate-100">
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
