"use client";

import { motion } from "framer-motion";
import { Star, MapPin, Wrench } from "lucide-react";
import SectionHeading from "./SectionHeading";
import {
  gaikouTestimonials,
  testimonialsArePlaceholder,
  testimonialsDisclaimer,
} from "@/data/gaikou/testimonials";

// お客様の声（施工事例セクションの直下）。
// 顔写真は使用しない。スマホは縦1列、デスクトップは3列。
// データは data/gaikou/testimonials.ts で管理し、実際の声が揃ったら差し替える。
export default function TestimonialsSection() {
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          eyebrow="VOICE"
          title={"お客様の声"}
          description={"地域・年代・工事内容とあわせてご紹介します"}
        />

        {testimonialsArePlaceholder && (
          <p className="mt-6 text-center text-[12px] sm:text-[13px] font-semibold text-[#a85a1f] bg-[#fff7ec] border border-[#e8a25a] rounded-xl px-4 py-2.5 max-w-xl mx-auto">
            {testimonialsDisclaimer}
          </p>
        )}

        <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {gaikouTestimonials.map((item, i) => (
            <motion.article
              key={item.region + item.profile}
              className="flex flex-col rounded-2xl border border-[#e7e3d8] bg-white p-5"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between gap-2">
                <div
                  className="flex items-center gap-0.5"
                  role="img"
                  aria-label={`5段階中${item.rating}の評価`}
                >
                  {Array.from({ length: 5 }, (_, s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${s < item.rating ? "text-[#e8a25a] fill-[#e8a25a]" : "text-[#e7e3d8]"}`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                {testimonialsArePlaceholder && (
                  <span className="text-[10px] font-bold text-[#a85a1f] bg-[#fff7ec] border border-[#e8a25a]/60 rounded-full px-2 py-0.5 shrink-0">
                    掲載イメージ
                  </span>
                )}
              </div>

              <p className="mt-3 flex-1 text-[13.5px] sm:text-sm text-[#3d4a45] leading-relaxed">
                「{item.quote}」
              </p>

              <div className="mt-4 pt-3 border-t border-[#f0ece1] space-y-1">
                <p className="flex items-center gap-1.5 text-[12px] font-semibold text-[#10302a]">
                  <MapPin className="w-3.5 h-3.5 text-[#2f7d5a] shrink-0" aria-hidden="true" />
                  {item.region}／{item.profile}
                </p>
                <p className="flex items-center gap-1.5 text-[11.5px] text-[#8a9a90]">
                  <Wrench className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  {item.workLabel}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
