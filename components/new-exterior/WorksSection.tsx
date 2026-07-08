"use client";

import { motion } from "framer-motion";
import { Camera, Clock, BadgePercent } from "lucide-react";
import Image from "next/image";
import { works } from "./data";
import SectionHeading from "@/components/gaikou/SectionHeading";
import CTABlock from "./CTABlock";

export default function WorksSection() {
  return (
    <section id="works" className="gaikou-washi-bg relative px-4 sm:px-6 py-16 md:py-24 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeading
          dark
          eyebrow="WORKS"
          title={"新築外構の施工事例"}
          description={
            "ハウスメーカーの外構見積もりが高いと感じた方へ。\n駐車場・門柱・アプローチ・フェンス・庭まわりまで、外構専門店への直接相談で費用を抑えやすくなります。"
          }
        />

        <div className="mt-10 md:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
          {works.map((work, i) => (
            <motion.article
              key={work.id}
              className="group rounded-[16px] sm:rounded-[18px] bg-white overflow-hidden flex flex-col shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08, ease: "easeOut" }}
            >
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
                {/* 直接相談価格ラベル */}
                <span className="absolute top-2 left-2 inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1f4d3d]/90 text-white">
                  <BadgePercent className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" aria-hidden="true" />
                  外構専門店へ直接相談価格
                </span>
              </div>

              <div className="flex flex-col gap-1.5 p-2.5 sm:p-4 flex-1">
                <h3 className="text-[12px] sm:text-sm font-bold text-[#1c2b25] leading-snug">
                  {work.title}
                </h3>

                {/* 費用総額（オレンジで控えめに強調） */}
                <p className="text-[12px] sm:text-sm leading-tight">
                  <span className="text-[#6b7a73]">費用総額 </span>
                  <span className="text-[15px] sm:text-[17px] font-bold text-[#d9601a]">{work.price}</span>
                </p>

                <p className="flex items-center gap-1 text-[11px] sm:text-xs text-[#6b7a73]">
                  <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />
                  工期目安 {work.duration}
                </p>
                <p className="text-[11px] sm:text-xs text-[#52615c] leading-relaxed">{work.description}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="mt-6 text-center text-[11px] text-white/50 leading-relaxed">
          ※掲載価格は標準仕様での目安です。敷地条件・施工面積・使用部材・残土処分の有無により変動します。
        </p>

        <div className="mt-10 md:mt-14">
          <CTABlock dark />
        </div>
      </div>
    </section>
  );
}
