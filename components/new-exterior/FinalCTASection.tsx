"use client";

import { motion } from "framer-motion";
import { CircleCheckBig, ShieldCheck, HandHeart } from "lucide-react";
import CTABlock from "./CTABlock";
import { StaffGuide } from "./svg/LineArtPeople";
import { Burst } from "./svg/Decor";

const POINTS = [
  { icon: CircleCheckBig, text: "現地調査・お見積もりは無料です。" },
  { icon: ShieldCheck, text: "診断後にお断りいただいても費用はかかりません。" },
  { icon: HandHeart, text: "強引な営業や、その場での契約は求めません。" },
];

// 診断フォームへの最終導線。悩み共感→安心材料→CTAの順で背中を押す。
export default function FinalCTASection() {
  return (
    <section id="contact" className="relative px-4 sm:px-6 py-16 md:py-24 overflow-hidden">
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="rounded-3xl bg-[#2f3527] text-white p-6 sm:p-10 text-center overflow-hidden relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <span className="ne-eyebrow !text-[#cdb98a] justify-center">無料診断</span>
          <h2 className="ne-serif mt-3 text-[1.4rem] sm:text-[1.8rem] font-bold leading-snug tracking-wide">
            新築外構、いくらでできる？
            <br />
            まずは無料診断でチェック
          </h2>
          <p className="mt-4 text-[14px] sm:text-[16px] text-white/70 leading-relaxed">
            かんたんな質問に答えるだけで、担当者がご予算に合わせた
            <br className="hidden sm:block" />
            外構プランと概算をご案内します。
          </p>

          <div className="mt-6 flex items-end justify-center gap-2 sm:gap-5 text-left max-w-lg mx-auto">
            <div className="space-y-2.5 flex-1">
              {POINTS.map((point) => (
                <div key={point.text} className="flex items-start gap-2.5">
                  <point.icon className="w-4.5 h-4.5 text-[#b7c39a] mt-0.5 shrink-0" aria-hidden="true" />
                  <p className="text-[14px] sm:text-[15px] font-semibold text-white/85 leading-relaxed">{point.text}</p>
                </div>
              ))}
            </div>
            <div className="shrink-0 flex flex-col items-center">
              <p className="ne-bubble-soft text-[13px] sm:text-[14px] text-center !px-3 !py-2 font-bold">
                お気軽に
                <br />
                どうぞ！
              </p>
              <span className="mt-3 inline-block rounded-full bg-white/95 p-1"><StaffGuide className="w-24 sm:w-28" /></span>
            </div>
          </div>

          <div className="mt-7 relative">
            <Burst color="gold" size={78} rotate={-10} className="!absolute -top-9 -left-1 sm:left-6 z-[1] hidden min-[380px]:inline-flex">
              相談だけ
              <br />
              でもOK
            </Burst>
            <CTABlock dark />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
