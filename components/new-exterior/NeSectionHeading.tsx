"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

// FVクリエイティブに合わせたセクション見出し。
// 葉飾り付きの小ラベル＋明朝体タイトル＋金茶の筆線スウッシュ。

function LeafOrnament({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      width="26"
      height="12"
      viewBox="0 0 26 12"
      fill="none"
      aria-hidden="true"
      className={flip ? "-scale-x-100" : undefined}
    >
      <path d="M1 8 C 8 8, 18 8, 25 6" stroke="#8a9573" strokeWidth="1" />
      <path d="M7 8 C 7 5, 9 3, 12 2.4 C 11.4 5.4, 9.6 7.2, 7 8 Z" fill="#8a9573" />
      <path d="M13 7.4 C 13 5, 14.6 3.4, 17 2.8 C 16.6 5.2, 15.2 6.8, 13 7.4 Z" fill="#a8ad8c" />
    </svg>
  );
}

type NeSectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  as?: "h2" | "h3";
  dark?: boolean;
};

export default function NeSectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  as = "h2",
  dark = false,
}: NeSectionHeadingProps) {
  const Heading = as;
  const isCenter = align === "center";

  return (
    <div className={isCenter ? "text-center" : "text-left"}>
      {eyebrow && (
        <span className={`ne-eyebrow ${dark ? "!text-[#cdb98a]" : ""}`}>
          <LeafOrnament />
          {eyebrow}
          <LeafOrnament flip />
        </span>
      )}
      <Heading
        className={`ne-serif mt-3 text-[1.5rem] sm:text-[1.9rem] md:text-[2.25rem] font-bold leading-snug tracking-wide whitespace-pre-line ${
          dark ? "text-white" : "text-[#2f3527]"
        }`}
      >
        {title}
      </Heading>
      {/* 筆線風のスウッシュ（FVの見出し下の飾りを踏襲） */}
      <motion.svg
        width="120"
        height="12"
        viewBox="0 0 120 12"
        fill="none"
        aria-hidden="true"
        className={`mt-3 ${isCenter ? "mx-auto" : ""} block`}
        initial={{ opacity: 0, scaleX: 0.6 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <path
          d="M2 8 C 30 3, 60 9, 88 5 C 100 3.5, 110 4.5, 118 6"
          stroke="#cdb98a"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </motion.svg>
      {description && (
        <p
          className={`mt-4 text-[15px] sm:text-base leading-relaxed whitespace-pre-line ${
            dark ? "text-white/60" : "text-[#5f5f52]"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
