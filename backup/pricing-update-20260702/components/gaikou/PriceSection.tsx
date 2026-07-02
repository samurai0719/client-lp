"use client";

import { motion } from "framer-motion";
import { CarFront, Tag } from "lucide-react";
import { prices } from "./data";
import SectionHeading from "./SectionHeading";
import CTABlock from "./CTABlock";
import SectionBackdrop from "./SectionBackdrop";

export default function PriceSection() {
  const [main, ...rest] = prices;

  return (
    <section id="price" className="relative px-4 sm:px-6 py-16 md:py-24 overflow-hidden">
      <SectionBackdrop variant="triangle-down" tone="orange" />
      <div className="relative z-10 max-w-4xl mx-auto">
        <SectionHeading eyebrow="PRICE" title={"料金の目安"} description={"確定している料金と、今後ご案内する料金の目安です"} />

        <motion.div
          className="mt-10 md:mt-12 rounded-2xl border-2 border-[#e8a25a] bg-gradient-to-br from-[#fff7ec] to-[#fef2e2] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 sm:gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <span className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-sm shrink-0">
            <CarFront className="w-8 h-8 sm:w-10 sm:h-10 text-[#d9601a]" aria-hidden="true" />
          </span>
          <div className="text-center sm:text-left">
            {main.badge && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#1f4d3d] text-white mb-2">
                <Tag className="w-3 h-3" aria-hidden="true" />
                {main.badge}
              </span>
            )}
            <p className="text-sm sm:text-base font-semibold text-[#5a4326]">{main.label}</p>
            <p className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#d9601a]">{main.price}</p>
            {main.note && <p className="mt-1 text-xs text-[#8a7a55]">{main.note}</p>}
          </div>
        </motion.div>

        <p className="mt-3 text-[11px] sm:text-xs text-[#8a9a90] text-center leading-relaxed">
          ※撤去・残土処分・目地・デザイン施工・各種設備工事などは別途お見積もりとなります。
        </p>

        <div className="mt-6 grid sm:grid-cols-2 gap-3 sm:gap-4">
          {rest.map((p, i) => (
            <motion.div
              key={p.label}
              className="flex items-center justify-between rounded-xl border border-[#e7e3d8] bg-white px-5 py-4"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: i * 0.05, ease: "easeOut" }}
            >
              <span className="text-[13px] sm:text-sm font-semibold text-[#1c2b25]">{p.label}</span>
              <span className="text-[12px] sm:text-sm text-[#6b7a73] text-right">{p.price}</span>
            </motion.div>
          ))}
        </div>

        <p className="mt-6 text-xs sm:text-sm text-[#6b7a73] text-center leading-relaxed">
          上記以外の料金は確定後にご案内します。架空の金額は掲載していません。
        </p>

        <div className="mt-12 md:mt-16">
          <CTABlock />
        </div>
      </div>
    </section>
  );
}
