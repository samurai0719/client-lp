"use client";

import { motion } from "framer-motion";
import { Camera, MapPin, Clock } from "lucide-react";
import Image from "next/image";
import { works } from "./data";
import SectionHeading from "./SectionHeading";
import CTABlock from "./CTABlock";
import BeforeAfterSlider from "./BeforeAfterSlider";

export default function WorksGrid() {
  return (
    <section id="works" className="gaikou-washi-bg relative px-4 sm:px-6 py-16 md:py-24 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeading
          dark
          eyebrow="WORKS"
          title={"外構リフォーム施工事例"}
          description={"暮らしのお悩みに合わせた外構リフォームをご提案します"}
        />

        <div className="mt-10 md:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
          {works.map((work, i) => {
            const hasBeforeAfter = Boolean(work.beforeImage && work.afterImage);
            return (
              <motion.article
                key={work.id}
                className="group rounded-[16px] sm:rounded-[18px] bg-white overflow-hidden flex flex-col shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08, ease: "easeOut" }}
              >
                {hasBeforeAfter ? (
                  <BeforeAfterSlider
                    beforeSrc={work.beforeImage!}
                    afterSrc={work.afterImage!}
                    beforeAlt={`${work.title}（施工前）`}
                    afterAlt={`${work.title}（施工後）`}
                    className="aspect-[4/3] w-full"
                  />
                ) : (
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-[#eef3ee] to-[#f3eee2]">
                    {work.image ? (
                      <Image
                        src={work.image}
                        alt={work.title}
                        fill
                        sizes="(min-width: 1024px) 25vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-[#8a9a90]">
                        <Camera className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={1.6} aria-hidden="true" />
                        <span className="text-[11px] sm:text-xs font-medium">写真準備中</span>
                      </div>
                    )}
                    {work.category && (
                      <span className="absolute top-2 left-2 text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full bg-white/90 text-[#1f4d3d]">
                        {work.category}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-1.5 p-2.5 sm:p-4 flex-1">
                  <h3 className="text-[12px] sm:text-sm font-bold text-[#1c2b25] leading-snug line-clamp-2">
                    {work.title}
                  </h3>
                  <p className="flex items-center gap-1 text-[11px] sm:text-xs text-[#6b7a73]">
                    <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
                    {work.area}
                  </p>
                  <p className="text-[12px] sm:text-sm leading-tight">
                    <span className="text-[#6b7a73]">施工金額 </span>
                    <span className="font-bold text-[#d9601a]">{work.price}</span>
                  </p>
                  <p className="flex items-center gap-1 text-[11px] sm:text-xs text-[#6b7a73]">
                    <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />
                    {work.duration}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-12 md:mt-16">
          <CTABlock dark />
        </div>
      </div>
    </section>
  );
}
