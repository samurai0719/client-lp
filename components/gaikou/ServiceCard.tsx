"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CarFront, Sprout, Fence, Check, type LucideIcon } from "lucide-react";
import type { ServiceCategory } from "./data";

const ICONS: Record<string, LucideIcon> = {
  "car-front": CarFront,
  sprout: Sprout,
  fence: Fence,
};

type ServiceCardProps = {
  category: ServiceCategory;
  index: number;
};

export default function ServiceCard({ category, index }: ServiceCardProps) {
  const Icon = ICONS[category.iconKey] ?? Fence;

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-[#e7e3d8] bg-white p-6 sm:p-7"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
      <svg
        className="absolute -right-6 -top-6 w-28 h-28 text-[#eaf3ee] pointer-events-none sm:block hidden"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="50" fill="currentColor" />
      </svg>

      <div className="flex gap-4 sm:block">
        <div className="flex-1 min-w-0">
          <span className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-[#1f4d3d] text-white mb-4">
            <Icon className="w-6 h-6" aria-hidden="true" />
          </span>

          <h3 className="relative text-base sm:text-lg font-bold text-[#10302a] mb-4">{category.title}</h3>

          <ul className="relative space-y-2">
            {category.items.map((item) => (
              <li key={item} className="flex items-start gap-2 text-[13px] sm:text-sm text-[#3d4a45]">
                <Check className="w-4 h-4 mt-0.5 text-[#2f7d5a] shrink-0" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {category.image && (
          <div className="sm:hidden shrink-0 w-64 h-64 relative rounded-xl overflow-hidden">
            <Image
              src={category.image}
              alt={category.title}
              fill
              sizes="256px"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
