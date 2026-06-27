"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Layers,
  CarFront,
  Sprout,
  Umbrella,
  Eye,
  TreeDeciduous,
  MoveDiagonal,
  ArrowRight,
  ArrowDown,
  type LucideIcon,
} from "lucide-react";
import { solutions } from "./data";
import SectionHeading from "./SectionHeading";
import CTABlock from "./CTABlock";
import SectionBackdrop from "./SectionBackdrop";

const ICONS: Record<string, LucideIcon> = {
  layers: Layers,
  "car-front": CarFront,
  sprout: Sprout,
  umbrella: Umbrella,
  eye: Eye,
  "tree-deciduous": TreeDeciduous,
  "move-diagonal": MoveDiagonal,
};

function SolutionPhoto({
  src,
  alt,
  areaClassName,
}: {
  src: string;
  alt: string;
  areaClassName: string;
}) {
  return (
    <div className={`gaikou-photo-slot ${areaClassName}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 640px) 260px, 145px"
          className="object-cover"
        />
      ) : (
        <span className="gaikou-photo-slot-empty absolute inset-0">画像を追加</span>
      )}
    </div>
  );
}

export default function SolutionsSection() {
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24 overflow-hidden">
      <SectionBackdrop variant="diagonal" tone="green" />
      <div className="relative z-10 max-w-4xl mx-auto">
        <SectionHeading
          eyebrow="SOLUTION"
          title={
            <>
              <span className="block">そのお悩み</span>
              <span className="inline-flex items-center justify-center gap-2 flex-wrap">
                <Image
                  src="/images/gaikou/logo-transparent.png"
                  alt=""
                  width={40}
                  height={40}
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                  aria-hidden="true"
                />
                高長建設が解決します！
              </span>
            </>
          }
          description={"お悩みに合わせた解決方法をご提案します"}
        />

        <div className="mt-10 md:mt-14 flex flex-col gap-3 sm:gap-4">
          {solutions.map((s, i) => {
            const Icon = ICONS[s.iconKey] ?? Layers;
            return (
              <motion.div
                key={s.problem}
                className="rounded-2xl border border-[#e7e3d8] bg-white px-3 py-4 sm:px-4 sm:py-5"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: (i % 7) * 0.05, ease: "easeOut" }}
              >
                <div className="gaikou-solution-row">
                  <div className="gaikou-solution-worry flex items-center gap-3 rounded-xl bg-[#f6f3ea] px-4 py-3">
                    <span className="text-[11px] font-bold text-[#a07a3a] shrink-0">悩み</span>
                    <span className="text-[13px] sm:text-sm font-semibold text-[#3d3a30]">{s.problem}</span>
                  </div>

                  <SolutionPhoto
                    src={s.beforeImage}
                    alt={`${s.problem}の施工前`}
                    areaClassName="gaikou-solution-before"
                  />

                  <div className="gaikou-solution-arrow flex items-center justify-center">
                    <ArrowDown className="w-6 h-6 text-[#9bb3a8] sm:hidden shrink-0" aria-hidden="true" />
                    <ArrowRight className="w-5 h-5 text-[#9bb3a8] hidden sm:block shrink-0" aria-hidden="true" />
                  </div>

                  <div className="gaikou-solution-solution flex items-center gap-3 rounded-xl bg-[#eaf3ee] px-4 py-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1f4d3d] text-white shrink-0">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <span className="text-[13px] sm:text-sm font-bold text-[#1f4d3d]">{s.solution}</span>
                  </div>

                  <SolutionPhoto
                    src={s.afterImage}
                    alt={`${s.problem}の施工後`}
                    areaClassName="gaikou-solution-after"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 md:mt-16">
          <CTABlock />
        </div>
      </div>
    </section>
  );
}
