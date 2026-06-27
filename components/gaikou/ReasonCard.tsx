"use client";

import { motion } from "framer-motion";
import {
  Handshake,
  ClipboardCheck,
  FileText,
  Layers,
  Camera,
  MapPinned,
  type LucideIcon,
} from "lucide-react";
import type { ReasonItem } from "./data";

const ICONS: Record<string, LucideIcon> = {
  handshake: Handshake,
  "clipboard-check": ClipboardCheck,
  "file-text": FileText,
  layers: Layers,
  camera: Camera,
  "map-pinned": MapPinned,
};

type ReasonCardProps = {
  reason: ReasonItem;
  index: number;
};

export default function ReasonCard({ reason, index }: ReasonCardProps) {
  const Icon = ICONS[reason.iconKey] ?? Handshake;

  return (
    <motion.div
      className="flex gap-4 rounded-2xl border border-[#e7e3d8] bg-white p-5 sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.08, ease: "easeOut" }}
    >
      <div className="flex flex-col items-center shrink-0">
        <span className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1f4d3d] text-white">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
        </span>
        <span className="mt-1.5 text-[11px] font-bold text-[#9bb3a8]">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div>
        <h3 className="text-[14px] sm:text-base font-bold text-[#10302a] leading-snug">{reason.title}</h3>
        <p className="mt-1.5 text-[12.5px] sm:text-sm text-[#52615c] leading-relaxed">{reason.body}</p>
      </div>
    </motion.div>
  );
}
