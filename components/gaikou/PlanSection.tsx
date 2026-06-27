"use client";

import { motion } from "framer-motion";
import { Camera, Clock } from "lucide-react";
import Image from "next/image";
import { plans } from "./data";
import SectionHeading from "./SectionHeading";

export default function PlanSection() {
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <SectionHeading eyebrow="PLAN" title={"予算別プラン例"} description={"よくご相談いただく組み合わせの例です"} />

        <div className="mt-10 md:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              className="rounded-2xl border border-[#e7e3d8] bg-white overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.08, ease: "easeOut" }}
            >
              <div className="relative aspect-[4/3] bg-gradient-to-br from-[#eef3ee] to-[#f3eee2]">
                {plan.image ? (
                  <Image src={plan.image} alt={plan.title} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-[#8a9a90]">
                    <Camera className="w-6 h-6" strokeWidth={1.6} aria-hidden="true" />
                    <span className="text-[10px] font-medium">写真準備中</span>
                  </div>
                )}
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="text-[12.5px] sm:text-sm font-bold text-[#10302a] leading-snug">{plan.title}</h3>
                <p className="mt-1.5 text-[12px] sm:text-sm font-bold text-[#d9601a]">{plan.price}</p>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-[#6b7a73]">
                  <Clock className="w-3 h-3 shrink-0" aria-hidden="true" />
                  {plan.duration}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
