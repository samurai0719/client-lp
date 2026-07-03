"use client";

import { motion } from "framer-motion";
import { User, Award, FileBadge, MapPin, Map, Quote } from "lucide-react";
import SectionHeading from "./SectionHeading";

const PROFILE_ROWS = [
  { icon: Award, label: "経験年数", value: "確定後に掲載いたします" },
  { icon: FileBadge, label: "保有資格", value: "確定後に掲載いたします" },
  { icon: FileBadge, label: "建設業許可", value: "確定後に掲載いたします" },
  { icon: MapPin, label: "所在地", value: "確定後に掲載いたします" },
  { icon: Map, label: "対応地域", value: "岐阜県を中心に対応予定" },
];

export default function CompanySection() {
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <SectionHeading eyebrow="COMPANY" title={"職人・会社紹介"} description={"会社情報は確定後にあらためて公開いたします"} />

        <motion.div
          className="mt-10 md:mt-14 rounded-2xl border border-[#e7e3d8] bg-white p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-7">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <span className="flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#eaf3ee] border border-[#cfe3d6]">
                <User className="w-11 h-11 sm:w-12 sm:h-12 text-[#9bb3a8]" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="text-[11px] text-[#9bb3a8] font-medium">写真準備中</span>
            </div>

            <div className="flex-1 w-full">
              <dl className="grid sm:grid-cols-2 gap-3">
                {PROFILE_ROWS.map((row) => (
                  <div key={row.label} className="flex items-center gap-2.5 rounded-xl bg-[#f9f7f1] px-4 py-3">
                    <row.icon className="w-4 h-4 text-[#2f7d5a] shrink-0" aria-hidden="true" />
                    <div className="min-w-0">
                      <dt className="text-[11px] text-[#8a9a90]">{row.label}</dt>
                      <dd className="text-[12.5px] sm:text-sm font-semibold text-[#3d4a45] truncate">{row.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#e7e3d8] p-4">
              <p className="flex items-center gap-1.5 text-[12px] font-bold text-[#1f4d3d] mb-1.5">
                <Quote className="w-3.5 h-3.5" aria-hidden="true" />
                施工への考え方
              </p>
              <p className="text-[12.5px] sm:text-sm text-[#6b7a73] leading-relaxed">確定後に掲載いたします</p>
            </div>
            <div className="rounded-xl border border-[#e7e3d8] p-4">
              <p className="flex items-center gap-1.5 text-[12px] font-bold text-[#1f4d3d] mb-1.5">
                <Quote className="w-3.5 h-3.5" aria-hidden="true" />
                このサービスを始めた理由
              </p>
              <p className="text-[12.5px] sm:text-sm text-[#6b7a73] leading-relaxed">確定後に掲載いたします</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
