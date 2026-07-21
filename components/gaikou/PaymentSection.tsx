"use client";

import { motion } from "framer-motion";
import { Banknote, CircleDollarSign, CircleCheckBig, Landmark, type LucideIcon } from "lucide-react";
import { paymentInfoItems } from "./data";
import SectionHeading from "./SectionHeading";

const ICONS: Record<string, LucideIcon> = {
  banknote: Banknote,
  "circle-dollar-sign": CircleDollarSign,
  "check-circle-2": CircleCheckBig,
  landmark: Landmark,
};

export default function PaymentSection() {
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          eyebrow="PAYMENT"
          title={"お支払いについて"}
          description={"現金でのお支払いに対応しています。着工前20%・施工完了後80%の分割払いです。"}
        />

        <div className="mt-10 md:mt-14 grid sm:grid-cols-2 gap-3 sm:gap-4">
          {paymentInfoItems.map((item, i) => {
            const Icon = ICONS[item.iconKey] ?? Banknote;
            return (
              <motion.div
                key={item.title}
                className="rounded-xl border border-[#e7e3d8] bg-white p-4 sm:p-5"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: (i % 7) * 0.05, ease: "easeOut" }}
              >
                <Icon className="w-5 h-5 text-[#1f4d3d] mb-2" aria-hidden="true" />
                <p className="text-[13px] sm:text-sm font-bold text-[#10302a]">{item.title}</p>
                <p className="mt-1 text-[12px] sm:text-[13px] text-[#8a9a90] leading-relaxed">{item.body}</p>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-7 sm:mt-8 text-center text-[11px] text-[#9bb3a8] leading-relaxed px-5">
          ※お支払い時期・方法の詳細はご契約時にご説明します。銀行のリフォームローンをご希望の場合もご相談ください。
        </p>
      </div>
    </section>
  );
}
