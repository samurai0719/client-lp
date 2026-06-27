"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { qualityPoints } from "./data";
import SectionHeading from "./SectionHeading";

export default function QualitySection() {
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          eyebrow="QUALITY"
          title={"見えない部分まで丁寧に施工"}
          description={"完成後は見えなくなる部分こそ、品質を左右します"}
        />

        <div className="mt-10 md:mt-14 rounded-2xl border border-[#e7e3d8] bg-white p-4 sm:p-8 overflow-hidden">
          <svg viewBox="0 0 400 200" className="w-full h-auto max-w-md mx-auto" role="img" aria-label="土間コンクリート断面の構造図">
            {/* 地盤 */}
            <rect x="0" y="140" width="400" height="60" fill="#e7ddc8" />
            {/* 砕石 */}
            <rect x="0" y="100" width="400" height="40" fill="#d8d2c2" />
            {[...Array(14)].map((_, i) => (
              <circle key={i} cx={20 + i * 28} cy={110 + (i % 2) * 16} r="3.2" fill="#b7ad94" />
            ))}
            {/* コンクリート（水勾配で右がわずかに低い） */}
            <motion.path
              d="M0 60 L400 68 L400 100 L0 100 Z"
              fill="#cfd6d2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            />
            {/* ワイヤーメッシュ */}
            <g stroke="#8a958f" strokeWidth="1.2" opacity="0.8">
              {[...Array(7)].map((_, i) => (
                <line key={`v${i}`} x1={20 + i * 60} y1="82" x2={20 + i * 60} y2="92" />
              ))}
              <line x1="0" y1="87" x2="400" y2="90.4" />
            </g>
            {/* 伸縮目地 */}
            {[100, 200, 300].map((x) => (
              <rect key={x} x={x - 1.5} y="60" width="3" height="42" fill="#ffffff" stroke="#aab4ae" strokeWidth="0.5" />
            ))}
            {/* 転圧の矢印 */}
            {[60, 180, 300].map((x) => (
              <path
                key={x}
                d={`M${x} 92 L${x} 108`}
                stroke="#2f7d5a"
                strokeWidth="2"
                markerEnd="url(#gaikou-arrow)"
              />
            ))}
            <defs>
              <marker id="gaikou-arrow" markerWidth="6" markerHeight="6" refX="3" refY="5" orient="auto">
                <path d="M0 0 L6 0 L3 6 Z" fill="#2f7d5a" />
              </marker>
            </defs>

            {/* ラベル */}
            <text x="8" y="78" fontSize="11" fill="#10302a" fontWeight="700">コンクリート</text>
            <text x="8" y="124" fontSize="11" fill="#5a503a" fontWeight="700">砕石</text>
            <text x="8" y="172" fontSize="11" fill="#7a6b46" fontWeight="700">地盤</text>
            <text x="230" y="78" fontSize="10" fill="#5a655f">ワイヤーメッシュ</text>
            <text x="310" y="56" fontSize="10" fill="#5a655f">水勾配</text>
          </svg>

          <div className="mt-8 grid sm:grid-cols-2 gap-3 sm:gap-4">
            {qualityPoints.map((point, i) => (
              <motion.div
                key={point.label}
                className="flex items-start gap-2.5 rounded-xl bg-[#f9f7f1] px-4 py-3"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: (i % 8) * 0.04, ease: "easeOut" }}
              >
                <CheckCircle2 className="w-4 h-4 text-[#2f7d5a] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[13px] sm:text-sm font-bold text-[#1c2b25]">{point.label}</p>
                  <p className="text-[12px] sm:text-[13px] text-[#6b7a73] mt-0.5 leading-relaxed">{point.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
