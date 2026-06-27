"use client";

import { motion } from "framer-motion";
import {
  Wind,
  CloudRain,
  Sprout,
  CarFront,
  TreeDeciduous,
  Eye,
  Warehouse,
  CircleHelp,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { problems } from "./data";
import SectionHeading from "./SectionHeading";
import SectionBackdrop from "./SectionBackdrop";

const ICONS: Record<string, LucideIcon> = {
  wind: Wind,
  "cloud-rain": CloudRain,
  sprout: Sprout,
  "car-front": CarFront,
  "tree-deciduous": TreeDeciduous,
  eye: Eye,
  warehouse: Warehouse,
  "circle-help": CircleHelp,
  "shield-check": ShieldCheck,
};

export default function ProblemsSection() {
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24 overflow-hidden">
      <SectionBackdrop variant="triangle-down" tone="beige" />
      <div className="relative z-10 max-w-5xl mx-auto">
        <SectionHeading
          eyebrow="WORRIES"
          title={
            <>
              <span className="block">このようなお悩みは</span>
              <span className="block">ありませんか？</span>
            </>
          }
          description={"外構リフォームのご相談で、よくいただくお声です"}
        />

        <div className="mt-10 md:mt-14 grid grid-cols-2 sm:grid-cols-3 gap-[14px] sm:gap-4">
          {problems.map((p, i) => {
            const Icon = ICONS[p.iconKey] ?? CircleHelp;
            return (
              <motion.div
                key={p.text}
                className="flex flex-col items-start gap-3 rounded-2xl bg-white border border-[#e7e3d8] px-4 py-[22px] sm:p-5 min-w-0"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.06, ease: "easeOut" }}
              >
                <span className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#eaf3ee] text-[#1f4d3d] shrink-0">
                  <Icon className="w-5 h-5" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <p className="text-[clamp(13px,3.8vw,15px)] sm:text-sm font-semibold text-[#1c2b25] leading-snug" style={{ overflowWrap: "anywhere" }}>{p.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
