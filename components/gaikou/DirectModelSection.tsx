"use client";

import { motion } from "framer-motion";
import { ArrowDown, Users, Megaphone, Building2, HardHat, Handshake } from "lucide-react";
import SectionBackdrop from "./SectionBackdrop";

const BROKERED_STEPS = [
  { icon: Users, label: "お客様" },
  { icon: Megaphone, label: "集客・営業会社" },
  { icon: Building2, label: "元請会社" },
  { icon: HardHat, label: "施工会社・職人" },
];

const DIRECT_STEPS = [
  { icon: Users, label: "お客様" },
  { icon: HardHat, label: "施工会社が直接対応" },
];

export default function DirectModelSection() {
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24 overflow-hidden">
      <SectionBackdrop variant="triangle-up" tone="cream" />
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center">
          <span className="gaikou-eyebrow">DIRECT</span>
          <h2 className="mt-3 text-[1.4rem] sm:text-[1.875rem] md:text-[2.25rem] font-bold leading-snug tracking-tight text-[#10302a]">
            外構工事は、
            <br />
            実際に施工する会社へ直接頼むのが一番です。
          </h2>
          <motion.span
            className="gaikou-heading-line mx-auto"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
          <p className="mt-5 text-[15px] sm:text-base font-semibold text-[#a85a1f] leading-relaxed">
            間に会社が増えるほど、
            <br />
            紹介料や管理費が工事価格に上乗せされる場合があります。
          </p>
        </div>

        <div className="mt-8 md:mt-10 space-y-4 text-sm sm:text-base text-[#3d4a45] leading-[1.9] max-w-2xl mx-auto">
          <p>
            外構工事を受け付けている会社が、
            <br />
            必ずしも実際に工事を行うとは限りません。
          </p>
          <p>
            契約後に別の施工会社へ工事を発注する仕組みでは、
            紹介料や管理費などの中間コストが発生し、
            お客様の見積金額に反映される場合があります。
          </p>
          <p>
            私たちは現地調査からお見積もり、
            施工管理、完成確認まで一貫して対応します。
          </p>
          <p>
            安さのために必要な工程を省くのではなく、
            不要な中間コストを省く。
            それが私たちの考える適正価格です。
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid sm:grid-cols-2 gap-6 sm:gap-8">
          <motion.div
            className="rounded-2xl border border-[#e7e3d8] bg-[#f9f7f1] p-5 sm:p-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs sm:text-sm font-bold text-[#8a7a55] text-center mb-5">一般的な仲介型</p>
            <div className="flex flex-col items-center gap-1.5">
              {BROKERED_STEPS.map((s, i) => (
                <div key={s.label} className="flex flex-col items-center gap-1.5 w-full">
                  <div className="flex items-center gap-2 w-full max-w-[220px] rounded-xl bg-white border border-[#e0dac8] px-3 py-2.5 justify-center">
                    <s.icon className="w-4 h-4 text-[#8a7a55] shrink-0" aria-hidden="true" />
                    <span className="text-[12px] sm:text-[13px] font-semibold text-[#5a503a]">{s.label}</span>
                  </div>
                  {i < BROKERED_STEPS.length - 1 && (
                    <ArrowDown className="w-4 h-4 text-[#c2b896]" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="rounded-2xl border-2 border-[#2f7d5a] bg-[#f3f9f5] p-5 sm:p-6 relative overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full bg-[#1f4d3d] text-white">
              私たちはこちら
            </span>
            <p className="text-xs sm:text-sm font-bold text-[#1f4d3d] text-center mb-5">直接対応型</p>
            <div className="flex flex-col items-center gap-1.5 justify-center h-full">
              {DIRECT_STEPS.map((s, i) => (
                <div key={s.label} className="flex flex-col items-center gap-1.5 w-full">
                  <div className="flex items-center gap-2 w-full max-w-[220px] rounded-xl bg-white border border-[#bfe0cd] px-3 py-3 justify-center shadow-sm">
                    <s.icon className="w-4 h-4 text-[#1f4d3d] shrink-0" aria-hidden="true" />
                    <span className="text-[13px] font-bold text-[#1f4d3d]">{s.label}</span>
                  </div>
                  {i < DIRECT_STEPS.length - 1 && (
                    <ArrowDown className="w-5 h-5 text-[#2f7d5a]" aria-hidden="true" />
                  )}
                </div>
              ))}
              <div className="flex items-center gap-1.5 mt-3 text-[#2f7d5a]">
                <Handshake className="w-4 h-4" aria-hidden="true" />
                <span className="text-[11px] font-semibold">中間コストを抑えた適正価格</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
