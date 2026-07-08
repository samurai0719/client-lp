"use client";

import { motion } from "framer-motion";
import {
  MapPinned,
  CircleCheckBig,
  PencilRuler,
  ListChecks,
  Layers,
  FileText,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { reasons } from "./data";
import NeSectionHeading from "./NeSectionHeading";

const ICONS: Record<string, LucideIcon> = {
  "map-pinned": MapPinned,
  "circle-check-big": CircleCheckBig,
  "pencil-ruler": PencilRuler,
  "list-checks": ListChecks,
  layers: Layers,
  "file-text": FileText,
  smartphone: Smartphone,
};

export default function ReasonsSection() {
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24 overflow-hidden bg-white">
      <div className="relative z-10 max-w-4xl mx-auto">
        <NeSectionHeading eyebrow="選ばれる理由" title={"選ばれる理由"} />

        <div className="mt-10 md:mt-14 grid sm:grid-cols-2 gap-4 sm:gap-5">
          {reasons.map((reason, i) => {
            const Icon = ICONS[reason.iconKey] ?? CircleCheckBig;
            return (
              <motion.div
                key={reason.title}
                className="flex gap-4 rounded-2xl bg-[#fbf9f2] shadow-[0_3px_16px_rgba(70,66,50,0.08)] p-5 sm:p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.08, ease: "easeOut" }}
              >
                <div className="flex flex-col items-center shrink-0">
                  <span className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#3f4d33] text-white">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                  </span>
                  <span className="mt-1.5 text-[12px] font-bold text-[#a8a68d]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="text-[15px] sm:text-base font-bold text-[#2f3527] leading-snug">{reason.title}</h3>
                  <p className="mt-1.5 text-[13.5px] sm:text-[15px] text-[#5f5f52] leading-relaxed">{reason.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
