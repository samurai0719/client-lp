"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { designExamples } from "./data";
import NeSectionHeading from "./NeSectionHeading";
import CTABlock from "./CTABlock";

export default function DesignExamplesSection() {
  return (
    <section id="design-examples" className="relative px-4 sm:px-6 py-16 md:py-24 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto">
        <NeSectionHeading
          eyebrow="デザイン例"
          title={"外構デザイン例"}
          description={
            "お好みのテイストをお聞かせください。\n建物の外観・色味に合わせてご提案します"
          }
        />

        <div className="mt-10 md:mt-14 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {designExamples.map((design, i) => (
            <motion.figure
              key={design.id}
              className="rounded-2xl bg-white overflow-hidden shadow-[0_3px_16px_rgba(70,66,50,0.08)] min-w-0"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: "easeOut" }}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={design.image}
                  alt={`${design.name}テイストの新築外構デザイン例`}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <figcaption className="p-3 sm:p-4">
                <p className="ne-serif text-[15px] sm:text-[17px] font-bold text-[#2f3527]">
                  {design.name}
                </p>
                <p className="mt-1 text-[13px] sm:text-[14px] text-[#5f5f52] leading-relaxed">
                  {design.description}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        <p className="mt-7 text-center text-[13px] sm:text-[14px] text-[#5f5f52] leading-relaxed">
          気になるテイストは、LP内の
          <span className="ne-marker font-bold">新築×外構シミュレーター</span>
          で完成イメージをお試しいただけます。
        </p>

        <div className="mt-10 md:mt-12">
          <CTABlock />
        </div>
      </div>
    </section>
  );
}
