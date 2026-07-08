"use client";

import { motion } from "framer-motion";
import { ArrowDown, Users, Building2, HardHat, Handshake } from "lucide-react";
import NeSectionHeading from "./NeSectionHeading";
import { RibbonHeading } from "./svg/Decor";
import { FlyingMoney } from "./svg/LineArtPeople";

const HM_STEPS = [
  { icon: Users, label: "お客様" },
  { icon: Building2, label: "ハウスメーカー" },
  { icon: HardHat, label: "下請け外構会社" },
  { icon: Handshake, label: "施工" },
];

const DIRECT_STEPS = [
  { icon: Users, label: "お客様" },
  { icon: HardHat, label: "外構会社" },
  { icon: Handshake, label: "施工" },
];

export default function HmCompareSection() {
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto">
        <NeSectionHeading
          eyebrow="高くなりやすい理由"
          title={"ハウスメーカー経由の外構が\n高くなりやすい理由"}
        />
        <p className="mt-5 text-center text-[16px] sm:text-base font-semibold text-[#9c5732] leading-relaxed">
          間に会社が入るほど、
          <br className="sm:hidden" />
          中間マージンが工事価格に乗りやすくなります。
        </p>

        <div className="mt-10 md:mt-12 grid sm:grid-cols-2 gap-6 sm:gap-8">
          <motion.div
            className="rounded-2xl border border-[#e2dcc9] bg-[#f4f0e2] p-5 sm:p-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[13px] sm:text-[15px] font-bold text-[#8a7a55] text-center mb-5">
              ハウスメーカー経由の場合
            </p>
            <div className="flex flex-col items-center gap-1.5">
              {HM_STEPS.map((s, i) => (
                <div key={s.label} className="flex flex-col items-center gap-1.5 w-full">
                  <div className="flex items-center gap-2 w-full max-w-[220px] rounded-xl bg-white border border-[#e0dac8] px-3 py-2.5 justify-center">
                    <s.icon className="w-4 h-4 text-[#8a7a55] shrink-0" aria-hidden="true" />
                    <span className="text-[13px] sm:text-[14px] font-semibold text-[#5a503a]">{s.label}</span>
                  </div>
                  {i < HM_STEPS.length - 1 && (
                    <ArrowDown className="w-4 h-4 text-[#c2b896]" aria-hidden="true" />
                  )}
                </div>
              ))}
              <div className="mt-3 flex items-center justify-center gap-1">
                <FlyingMoney className="w-14" />
                <FlyingMoney className="w-14 -scale-x-100" />
              </div>
              <p className="mt-1 text-[12px] font-semibold text-[#8a7a55] text-center leading-relaxed">
                工事費に<span className="ne-marker font-bold">中間マージンが上乗せ</span>
                <br />
                されて高くなりやすい
              </p>
            </div>
          </motion.div>

          <motion.div
            className="rounded-2xl border-2 border-[#6a7c50] bg-[#f2f3e6] p-5 sm:p-6 relative overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="absolute top-3 right-3 text-[11px] font-bold px-2 py-1 rounded-full bg-[#3f4d33] text-white">
              おすすめ
            </span>
            <p className="text-[13px] sm:text-[15px] font-bold text-[#3f4d33] text-center mb-5">
              外構専門会社へ直接相談の場合
            </p>
            <div className="flex flex-col items-center gap-1.5 justify-center">
              {DIRECT_STEPS.map((s, i) => (
                <div key={s.label} className="flex flex-col items-center gap-1.5 w-full">
                  <div className="flex items-center gap-2 w-full max-w-[220px] rounded-xl bg-white border border-[#d5cfb8] px-3 py-3 justify-center shadow-sm">
                    <s.icon className="w-4 h-4 text-[#3f4d33] shrink-0" aria-hidden="true" />
                    <span className="text-[14px] font-bold text-[#3f4d33]">{s.label}</span>
                  </div>
                  {i < DIRECT_STEPS.length - 1 && (
                    <ArrowDown className="w-5 h-5 text-[#6a7c50]" aria-hidden="true" />
                  )}
                </div>
              ))}
              <div className="mt-3 flex items-center justify-center">
                <FlyingMoney className="w-14" />
              </div>
              <p className="mt-1 text-[#3f4d33] text-[12px] font-semibold text-center leading-relaxed">
                支払うのは<span className="ne-marker font-bold">工事費のみ。</span>
                <br />
                余計な中間費用を抑えやすい
              </p>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 text-center">
          <RibbonHeading tone="terracotta">同じ工事でも、頼み方で費用は変わります</RibbonHeading>
        </div>

        <p className="mt-6 max-w-2xl mx-auto text-[14px] sm:text-[15px] text-[#5f5f52] leading-[1.9] text-left sm:text-center">
          必ず安くなるわけではありませんが、中間費用がかからないぶん
          <span className="ne-marker font-bold text-[#2f3527]">費用を抑えられる可能性</span>があり、
          同じ予算でも施工内容を充実させやすくなります。
          今お持ちのハウスメーカー見積もりとの比較相談も可能です。
        </p>
      </div>
    </section>
  );
}
