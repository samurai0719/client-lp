import { faqs } from "@/config/nurse-ranking";
import { SectionTitle } from "./ui";

/** よくある質問（回答は各社の公式案内に沿った内容。config/nurse-ranking.ts の faqs が唯一の情報源） */
export default function FaqSection() {
  return (
    <section aria-labelledby="faq-title" className="px-4 py-8">
      <SectionTitle id="faq-title" lines={["よくある質問"]} highlight={["質問"]} />
      <div className="space-y-2.5">
        {faqs.map((f) => (
          <details key={f.question} className="group rounded-xl border border-[#f7c9d8] bg-white open:bg-[#fff6f9]">
            <summary className="flex cursor-pointer list-none items-center gap-2.5 px-3.5 py-3 text-[14px] font-black text-slate-900 [&::-webkit-details-marker]:hidden">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e8437a] text-[12px] text-white">Q</span>
              <span className="flex-1">{f.question}</span>
              <span className="text-[#e8437a] transition group-open:rotate-180" aria-hidden="true">
                ▾
              </span>
            </summary>
            <div className="flex gap-2.5 px-3.5 pb-3.5 text-[13px] leading-relaxed text-slate-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[12px] font-black text-[#e8437a] ring-1 ring-[#f3a9c3]">A</span>
              <p className="flex-1 pt-0.5">{f.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
