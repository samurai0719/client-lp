"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { additionalCostCases } from "./data";
import SectionHeading from "./SectionHeading";

export default function AdditionalCostSection() {
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <SectionHeading
          eyebrow="TRANSPARENCY"
          title={"追加料金が発生するケース"}
          description={"現場の状況によって、以下のような追加工事が必要になる場合があります"}
        />

        <div className="mt-10 grid sm:grid-cols-3 gap-2.5 sm:gap-3">
          {additionalCostCases.map((item, i) => (
            <motion.div
              key={item}
              className="rounded-xl bg-[#f9f7f1] border border-[#e7e3d8] px-4 py-3 text-[13px] sm:text-sm font-medium text-[#5a503a] text-center"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: (i % 9) * 0.04, ease: "easeOut" }}
            >
              {item}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-10 flex items-start gap-3 rounded-2xl bg-[#eaf3ee] border border-[#bfe0cd] p-5 sm:p-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
        >
          <ShieldCheck className="w-6 h-6 text-[#1f4d3d] shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[14px] sm:text-base font-bold text-[#10302a] leading-relaxed">
            現地調査後に正式な金額をご提示し、
            <br />
            お客様の承諾のない追加工事は行いません。
          </p>
        </motion.div>
      </div>
    </section>
  );
}
