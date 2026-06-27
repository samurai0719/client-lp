"use client";

import Image from "next/image";
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
                className="flex flex-col rounded-2xl bg-white border border-[#e7e3d8] min-w-0 overflow-hidden"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.06, ease: "easeOut" }}
              >
                {p.image && (
                  <div className="w-full aspect-[4/3] relative shrink-0">
                    <Image
                      src={p.image}
                      alt={p.text}
                      fill
                      sizes="(max-width: 640px) calc(50vw - 22px), calc(33vw - 24px)"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col items-start gap-2.5 px-4 py-4 sm:p-5">
                  <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#eaf3ee] text-[#1f4d3d] shrink-0">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <p className="text-[clamp(12px,3.5vw,14px)] sm:text-sm font-semibold text-[#1c2b25] leading-snug" style={{ overflowWrap: "anywhere" }}>{p.text}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
