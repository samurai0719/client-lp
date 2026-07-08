"use client";

import { motion } from "framer-motion";
import { House, Tag } from "lucide-react";
import { prices } from "./data";
import { lpPriceTaxNote, newExteriorPriceDisclaimer } from "@/config/exterior-pricing";
import NeSectionHeading from "./NeSectionHeading";
import CTABlock from "./CTABlock";
import { Burst } from "./svg/Decor";

export default function PriceSection() {
  // 「新築外構一式」をメイン枠として強調し、残りを一覧表示する
  const main = prices.find((p) => p.label === "新築外構一式") ?? prices[prices.length - 1];
  const rest = prices.filter((p) => p !== main);

  return (
    <section id="price" className="relative px-4 sm:px-6 py-16 md:py-24 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto">
        <NeSectionHeading
          eyebrow="料金の目安"
          title={"料金の目安"}
          description={"標準的な施工条件での概算価格（参考価格）です"}
        />

        <div className="mt-10 md:mt-12 grid sm:grid-cols-2 gap-3 sm:gap-4">
          {rest.map((p, i) => (
            <motion.div
              key={p.label}
              className="flex items-center justify-between rounded-xl bg-white shadow-[0_3px_16px_rgba(70,66,50,0.08)] px-5 py-4"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: i * 0.05, ease: "easeOut" }}
            >
              <span className="text-[14px] sm:text-[15px] font-semibold text-[#2f3527]">{p.label}</span>
              <span className="text-[14px] sm:text-base font-bold text-[#b0502f] text-right shrink-0">{p.price}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="relative mt-6 rounded-2xl border-2 border-[#cdb98a] bg-gradient-to-br from-[#f7f1df] to-[#fef2e2] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 sm:gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <Burst
            color="terracotta"
            size={82}
            rotate={10}
            className="!absolute -top-5 -right-2 sm:-top-6 sm:-right-4 z-[1]"
          >
            一式でも
            <br />
            相談OK
          </Burst>
          <span className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-sm shrink-0">
            <House className="w-8 h-8 sm:w-10 sm:h-10 text-[#b0502f]" aria-hidden="true" />
          </span>
          <div className="text-center sm:text-left">
            <span className="inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-full bg-[#3f4d33] text-white mb-2">
              <Tag className="w-3 h-3" aria-hidden="true" />
              まとめてお得
            </span>
            <p className="text-[15px] sm:text-base font-semibold text-[#5a4326]">{main.label}</p>
            <p className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-[#b0502f]">{main.price}</p>
            {main.note && <p className="mt-1 text-[13px] text-[#8a7a55]">{main.note}</p>}
          </div>
        </motion.div>

        <p className="mt-4 text-[12px] sm:text-[13px] text-[#93927e] text-left sm:text-center leading-relaxed">
          {newExteriorPriceDisclaimer}
          <br />
          {lpPriceTaxNote}
        </p>

        <div className="mt-12 md:mt-16">
          <CTABlock />
        </div>
      </div>
    </section>
  );
}
