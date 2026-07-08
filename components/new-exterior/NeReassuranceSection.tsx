"use client";

import { motion } from "framer-motion";
import { CircleCheckBig, ShieldCheck, HandHeart } from "lucide-react";

const POINTS = [
  { icon: CircleCheckBig, text: "現地調査・お見積もりは無料です。" },
  { icon: ShieldCheck, text: "見積もり後にお断りいただいても費用はかかりません。" },
  { icon: HandHeart, text: "強引な営業や、その場での契約は求めません。" },
];

export default function NeReassuranceSection() {
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-20">
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="rounded-2xl bg-[#f2f3e6] border border-[#d5cfb8] p-6 sm:p-9 flex flex-col gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          {POINTS.map((point) => (
            <div key={point.text} className="flex items-start gap-3">
              <point.icon className="w-5 h-5 text-[#3f4d33] mt-0.5 shrink-0" aria-hidden="true" />
              <p className="text-[15px] sm:text-base font-semibold text-[#2f3527] leading-relaxed">{point.text}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
