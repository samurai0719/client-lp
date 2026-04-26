"use client";

import { useState } from "react";

const faqs = [
  {
    q: "転職活動中であることは、今の職場に知られますか？",
    a: "個人情報は厳重に管理しており、在職中の職場に知られることはありません。応募先への情報共有も、ご本人の承諾なしには行いません。",
  },
  {
    q: "転職先が決まるまでにどのくらいの期間がかかりますか？",
    a: "個人の状況やご希望によって異なりますが、平均的には2〜3ヶ月程度の方が多いです。急ぎの場合も、サポートスタッフが優先的にご対応します。",
  },
  {
    q: "今すぐ転職するつもりはないのですが、相談だけでも大丈夫ですか？",
    a: "もちろんです。「転職するかどうか迷っている」「まず情報収集したい」という方からのご相談も歓迎しています。無理な転職を勧めることはありません。",
  },
  {
    q: "利用料金はかかりますか？",
    a: "看護師の方への転職サポートは完全無料です。求人企業側から費用をいただく仕組みのため、求職者の方にご負担はありません。",
  },
  {
    q: "夜勤なし・日勤のみの求人はありますか？",
    a: "日勤のみの求人も多数取り扱っています。クリニック・健診センター・介護施設など、ライフスタイルに合わせた職場をご提案します。",
  },
  {
    q: "地方在住でも利用できますか？",
    a: "全国対応しています。電話・メール・オンラインでのサポートが可能なので、お住まいの地域にかかわらずご利用いただけます。",
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm"
        >
          <button
            className="w-full flex items-start justify-between gap-3 px-5 py-4 text-left hover:bg-slate-50 active:bg-slate-100 transition-colors duration-150 cursor-pointer"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
          >
            <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center select-none">
              {i + 1}
            </span>
            <span className="flex-1 text-base font-semibold text-slate-800 leading-relaxed text-left">
              {faq.q}
            </span>
            <span
              className={`shrink-0 mt-1 transition-transform duration-200 ${
                openIndex === i ? "rotate-180 text-blue-500" : "text-slate-400"
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

          {/* CSS grid trick for smooth height animation */}
          <div
            className="grid transition-[grid-template-rows] duration-300 ease-in-out"
            style={{ gridTemplateRows: openIndex === i ? "1fr" : "0fr" }}
          >
            <div className="overflow-hidden">
              <div className="px-5 pb-5 pt-3 border-t border-slate-100">
                <p className="text-base text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
