"use client";

import { motion } from "framer-motion";
import { ArrowRight, Handshake, HardHat, FileText, Users } from "lucide-react";
import DiagnosisLinkButton from "./DiagnosisLinkButton";

// ファーストビュー直下：広告（価格差・直接依頼・中間コスト削減）の訴求を
// 短く補強するセクション。詳しい仕組みの説明はこのセクションに集約する。
const POINTS = [
  { icon: Handshake, label: "中間業者をできる限り挟まない" },
  { icon: HardHat, label: "現地調査から施工まで直接対応" },
  { icon: FileText, label: "工事内容と費用を分かりやすく説明" },
];

export default function DirectAppealSection() {
  return (
    <section className="relative px-4 sm:px-6 py-10 md:py-14">
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="text-center">
          <span className="gaikou-eyebrow">DIRECT</span>
          <h2 className="mt-3 text-[1.25rem] sm:text-[1.75rem] md:text-[2rem] font-bold leading-snug tracking-tight text-[#10302a]">
            外構工事は、依頼先によって
            <br className="sm:hidden" />
            見積金額が大きく変わります
          </h2>
          <motion.span
            className="gaikou-heading-line mx-auto"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
          <p className="mt-4 text-[14px] sm:text-[15px] text-[#3d4a45] leading-relaxed max-w-xl mx-auto">
            高長建設は、現地調査から施工管理まで直接対応。
            <br className="hidden sm:block" />
            紹介料や不要な中間コストを抑え、適正価格でご提案します。
          </p>
        </div>

        {/* お客様→施工会社の直接対応を示すミニ図解 */}
        <div className="mt-6 flex items-center justify-center gap-2 sm:gap-3">
          <span className="flex items-center gap-1.5 rounded-xl bg-white border border-[#e7e3d8] px-3 py-2 text-[12px] sm:text-[13px] font-semibold text-[#3d4a45]">
            <Users className="w-4 h-4 text-[#1f4d3d] shrink-0" aria-hidden="true" />
            お客様
          </span>
          <ArrowRight className="w-4 h-4 text-[#2f7d5a] shrink-0" aria-hidden="true" />
          <span className="flex items-center gap-1.5 rounded-xl bg-[#f3f9f5] border-2 border-[#2f7d5a] px-3 py-2 text-[12px] sm:text-[13px] font-bold text-[#1f4d3d]">
            <HardHat className="w-4 h-4 shrink-0" aria-hidden="true" />
            高長建設（施工会社）が直接対応
          </span>
        </div>

        <div className="mt-5 grid sm:grid-cols-3 gap-2.5 sm:gap-3">
          {POINTS.map((point, i) => (
            <motion.div
              key={point.label}
              className="flex sm:flex-col items-center sm:text-center gap-2.5 rounded-xl border border-[#e7e3d8] bg-white px-3.5 py-3 sm:py-4"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#eaf3ee] shrink-0">
                <point.icon className="w-[18px] h-[18px] text-[#1f4d3d]" aria-hidden="true" />
              </span>
              <p className="text-[13px] sm:text-[13.5px] font-bold text-[#10302a] leading-snug">{point.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 max-w-[26rem] mx-auto">
          <DiagnosisLinkButton label="うちの場合の適正価格を確認する" className="w-full" />
        </div>
      </div>
    </section>
  );
}
