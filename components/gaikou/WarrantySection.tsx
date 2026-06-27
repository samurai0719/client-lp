"use client";

import { motion } from "framer-motion";
import {
  MessageCircle,
  Wrench,
  BadgeCheck,
  ClipboardCheck,
  CircleCheckBig,
  CircleAlert,
  CalendarCheck,
  type LucideIcon,
} from "lucide-react";
import { warrantyItems } from "./data";
import SectionHeading from "./SectionHeading";

const ICONS: Record<string, LucideIcon> = {
  "message-circle": MessageCircle,
  wrench: Wrench,
  "badge-check": BadgeCheck,
  "clipboard-check": ClipboardCheck,
  "circle-check-big": CircleCheckBig,
  "circle-alert": CircleAlert,
  "calendar-check": CalendarCheck,
};

export default function WarrantySection() {
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          eyebrow="WARRANTY"
          title={"保証・アフターサポート"}
          description={"保証内容は確定後にあらためてご案内します。架空の年数は掲載していません"}
        />

        <div className="mt-10 md:mt-14 grid sm:grid-cols-3 gap-3 sm:gap-4">
          {warrantyItems.map((item, i) => {
            const Icon = ICONS[item.iconKey] ?? CircleCheckBig;
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
                <p className="mt-1 text-[12px] sm:text-[13px] text-[#8a9a90]">{item.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
