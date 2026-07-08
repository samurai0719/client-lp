"use client";

import { motion } from "framer-motion";
import MedalBadge from "./svg/MedalBadge";

// FV直下の実績メダル（参考LPの王冠バッジと同スタイル）。
export default function TrustBadges() {
  return (
    <motion.div
      className="relative px-4 sm:px-6 pt-8 pb-2"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-md mx-auto">
        <div className="flex items-start justify-center gap-5 sm:gap-10">
          <MedalBadge
            topLabel="お客様満足度"
            main={
              <>
                No.<tspan fontSize="38">1</tspan>
              </>
            }
            mainSize={32}
            ribbon="高長建設"
            className="w-40 sm:w-48"
          />
          <MedalBadge
            topLabel="年間お問合せ数"
            main={
              <>
                1,000<tspan fontSize="17">件</tspan>
              </>
            }
            mainSize={28}
            sub="以上"
            ribbon="高長建設"
            className="w-40 sm:w-48"
          />
        </div>
        <p className="mt-2 text-right text-[11px] text-[#93927e]">※自社調べ</p>
      </div>
    </motion.div>
  );
}
