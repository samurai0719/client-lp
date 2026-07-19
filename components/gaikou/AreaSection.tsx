"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { serviceAreasByPrefecture } from "./data";
import SectionHeading from "./SectionHeading";

// Simplified schematic paths for the three Tokai prefectures
// ViewBox: 0 0 360 470
const PREFECTURE_PATHS = {
  gifu: "M 18,38 C 50,10 108,8 162,12 C 208,16 242,40 252,74 C 262,106 252,142 230,162 C 210,180 180,188 148,188 C 116,188 84,176 58,154 C 30,130 10,98 12,66 Z",
  aichi: "M 230,162 C 250,142 274,138 300,150 C 326,162 346,186 348,218 C 350,250 338,278 316,292 C 294,306 264,308 240,294 C 218,282 206,258 205,232 C 204,208 210,184 220,170 Z",
  mie: "M 148,188 C 175,184 202,196 205,232 C 208,258 218,282 222,316 C 226,350 222,390 210,422 C 200,448 182,464 160,462 C 138,460 122,440 114,412 C 106,382 108,348 112,316 C 116,284 124,256 130,226 Z",
};

const PREFECTURE_COLORS = ["#2f7d5a", "#1f4d3d", "#4a9070"];

export default function AreaSection() {
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24 overflow-hidden">
      {/* Inline SVG background — Tokai three prefecture shapes */}
      <svg
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[220px] sm:w-[300px] md:w-[360px] opacity-10 pointer-events-none"
        viewBox="0 0 360 470"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 岐阜県 */}
        <path d={PREFECTURE_PATHS.gifu} fill="#2f7d5a" />
        {/* 愛知県 */}
        <path d={PREFECTURE_PATHS.aichi} fill="#1f4d3d" />
        {/* 三重県 */}
        <path d={PREFECTURE_PATHS.mie} fill="#4a9070" />
        {/* Prefecture labels */}
        <text x="134" y="108" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#10302a" opacity="0.6">岐阜県</text>
        <text x="278" y="232" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#10302a" opacity="0.6">愛知県</text>
        <text x="168" y="340" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#10302a" opacity="0.6">三重県</text>
      </svg>

      <div className="relative max-w-3xl mx-auto">
        <SectionHeading
          eyebrow="AREA"
          title="対応エリア"
          description="岐阜県は全域に対応。愛知県・三重県の近隣エリアにも対応しています。エリア外もまずはご相談ください。"
        />

        <div className="mt-10 md:mt-14 flex flex-col gap-8">
          {serviceAreasByPrefecture.map((group, gi) => (
            <motion.div
              key={group.prefecture}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: gi * 0.1, ease: "easeOut" }}
            >
              {/* Prefecture header */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: PREFECTURE_COLORS[gi] }}
                >
                  <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                  {group.prefecture}
                </span>
                {group.coversAll && (
                  <span className="inline-flex items-center rounded-full bg-[#fff7ec] border border-[#e8a25a] px-3 py-1 text-[12px] sm:text-[13px] font-bold text-[#a85a1f]">
                    県内全域対応
                  </span>
                )}
              </div>

              {/* City badges */}
              <div className="flex flex-wrap gap-2">
                {group.cities.map((city, ci) => (
                  <motion.span
                    key={city}
                    className="flex items-center gap-1 rounded-full bg-white border border-[#cfe3d6] px-3.5 py-1.5 text-[13px] sm:text-sm font-medium text-[#1f4d3d]"
                    initial={{ opacity: 0, scale: 0.92 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.28, delay: gi * 0.1 + ci * 0.03, ease: "easeOut" }}
                  >
                    {city}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Other areas note */}
          <div className="flex items-center gap-2 pt-2">
            <span className="flex items-center gap-1.5 rounded-full bg-[#fff7ec] border border-[#e8a25a] px-4 py-2 text-[13px] sm:text-sm font-semibold text-[#a85a1f]">
              その他のエリア：要相談
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
