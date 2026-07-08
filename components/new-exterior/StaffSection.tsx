"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CircleCheckBig } from "lucide-react";
import NeSectionHeading from "./NeSectionHeading";
import CTABlock from "./CTABlock";

const POINTS = [
  "現地調査から施工まで、自社スタッフが一貫対応",
  "東海3県の地域密着。施工後の相談もしやすい",
  "新築外構の実績をもとに、建物に合うプランをご提案",
];

// 施工事例直下の「顔が見える」安心訴求セクション。
// 写真: public/images/gaikou/staff-team.png（リフォームLPと共用）
export default function StaffSection() {
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24 overflow-hidden bg-white">
      <div className="relative z-10 max-w-3xl mx-auto">
        <NeSectionHeading
          eyebrow="私たちについて"
          title={"私たちにお任せください"}
          description={"高長建設の外構専門スタッフが、\nお客様の新築外構を担当します"}
        />

        <motion.div
          className="mt-10 md:mt-12 rounded-3xl overflow-hidden shadow-[0_6px_28px_rgba(70,66,50,0.14)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <Image
            src="/images/gaikou/staff-team.png"
            alt="高長建設の外構専門スタッフの集合写真"
            width={1448}
            height={1086}
            sizes="(max-width: 768px) 100vw, 768px"
            className="w-full h-auto"
          />
        </motion.div>

        <div className="mt-8 max-w-xl mx-auto space-y-3">
          {POINTS.map((point) => (
            <div key={point} className="flex items-start gap-2.5">
              <CircleCheckBig className="w-5 h-5 text-[#5a6b46] mt-0.5 shrink-0" aria-hidden="true" />
              <p className="text-[15px] sm:text-base font-semibold text-[#2f3527] leading-relaxed">
                {point}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 max-w-xl mx-auto text-center text-[14px] sm:text-[15px] text-[#5f5f52] leading-[1.9]">
          「どこに頼めばいいか分からない」という段階のご相談も歓迎です。
          <br className="hidden sm:block" />
          お客様のご予算と暮らしに合わせて、
          <span className="ne-marker font-bold text-[#2f3527]">最適な外構プラン</span>
          をご提案します。
        </p>

        <div className="mt-10">
          <CTABlock />
        </div>
      </div>
    </section>
  );
}
