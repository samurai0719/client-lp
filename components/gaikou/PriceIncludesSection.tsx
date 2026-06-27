"use client";

import { motion } from "framer-motion";
import { priceIncludes } from "./data";
import SectionHeading from "./SectionHeading";

export default function PriceIncludesSection() {
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        <SectionHeading
          eyebrow="INCLUDED"
          title={"料金に含まれる内容"}
          description={"土間コンクリート工事の場合の工程例です"}
        />

        <div className="mt-10 md:mt-14 relative pl-[34px] sm:pl-[42px]">
          <motion.div
            className="absolute left-[15px] sm:left-[19px] top-2 bottom-2 w-px bg-[#cfe3d6] origin-top"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
          <ol className="space-y-4 sm:space-y-5">
            {priceIncludes.map((step, i) => (
              <motion.li
                key={step}
                className="relative flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
              >
                <span className="absolute -left-[34px] sm:-left-[42px] flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-[#2f7d5a] text-[#1f4d3d] text-xs sm:text-sm font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="text-[13.5px] sm:text-[15px] font-semibold text-[#1c2b25]">{step}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
