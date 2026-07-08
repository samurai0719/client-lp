"use client";

import { motion } from "framer-motion";
import {
  Handshake,
  Sparkles,
  PencilRuler,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";
import { merits } from "./data";
import NeSectionHeading from "./NeSectionHeading";
import CTABlock from "./CTABlock";

const ICONS: Record<string, LucideIcon> = {
  handshake: Handshake,
  sparkles: Sparkles,
  "pencil-ruler": PencilRuler,
  "messages-square": MessagesSquare,
};

export default function MeritsSection() {
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto">
        <NeSectionHeading
          eyebrow="直接相談のメリット"
          title={"外構専門会社へ\n直接相談するメリット"}
        />

        <div className="mt-10 md:mt-14 grid sm:grid-cols-2 gap-4 sm:gap-5">
          {merits.map((merit, i) => {
            const Icon = ICONS[merit.iconKey] ?? Handshake;
            return (
              <motion.div
                key={merit.title}
                className="flex gap-4 rounded-2xl bg-[#fbf9f2] shadow-[0_3px_16px_rgba(70,66,50,0.08)] p-5 sm:p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08, ease: "easeOut" }}
              >
                <span className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#3f4d33] text-white shrink-0">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="ne-script text-[17px] leading-none mb-1.5">Good point {i + 1}</p>
                  <h3 className="text-[15px] sm:text-base font-bold text-[#2f3527] leading-snug">{merit.title}</h3>
                  <p className="mt-1.5 text-[13.5px] sm:text-[15px] text-[#5f5f52] leading-relaxed">{merit.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 md:mt-14">
          <CTABlock />
        </div>
      </div>
    </section>
  );
}
