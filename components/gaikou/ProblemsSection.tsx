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
        <div className="relative pb-24 sm:pb-0">
          <Image
            src="/images/gaikou/mascot-worry-male.png"
            alt=""
            width={400}
            height={400}
            aria-hidden="true"
            className="absolute -left-3 sm:left-2 md:left-6 lg:left-10 bottom-0 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 -rotate-[9deg] w-40 sm:w-28 md:w-36 lg:w-44 h-auto select-none pointer-events-none drop-shadow-sm"
          />
          <Image
            src="/images/gaikou/mascot-worry-female.png"
            alt=""
            width={400}
            height={400}
            aria-hidden="true"
            className="absolute -right-3 sm:right-2 md:right-6 lg:right-10 bottom-0 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 rotate-[7deg] w-40 sm:w-28 md:w-36 lg:w-44 h-auto select-none pointer-events-none drop-shadow-sm"
          />
          <SectionHeading
            eyebrow="WORRIES"
            title={"このようなお悩みはありませんか？"}
            description={"外構リフォームのご相談で、よくいただくお声です"}
          />
        </div>

        <div className="mt-10 md:mt-14 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {problems.map((p, i) => {
            const Icon = ICONS[p.iconKey] ?? CircleHelp;
            return (
              <motion.div
                key={p.text}
                className="flex flex-col items-start gap-3 rounded-2xl bg-white border border-[#e7e3d8] p-4 sm:p-5"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.06, ease: "easeOut" }}
              >
                <span className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#eaf3ee] text-[#1f4d3d]">
                  <Icon className="w-5 h-5" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <p className="text-[13px] sm:text-sm font-semibold text-[#1c2b25] leading-snug">{p.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
