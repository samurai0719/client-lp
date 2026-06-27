"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
  as?: "h2" | "h3";
  dark?: boolean;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  as = "h2",
  dark = false,
}: SectionHeadingProps) {
  const Heading = as;
  const isCenter = align === "center";

  return (
    <div className={isCenter ? "text-center" : "text-left"}>
      {eyebrow && (
        <span className={`gaikou-eyebrow ${dark ? "gaikou-eyebrow-dark" : ""}`}>{eyebrow}</span>
      )}
      <Heading
        className={`mt-3 text-[1.5rem] sm:text-[1.875rem] md:text-[2.25rem] font-bold leading-snug tracking-tight whitespace-pre-line ${
          dark ? "text-white" : "text-[#10302a]"
        }`}
      >
        {title}
      </Heading>
      <motion.span
        className={`gaikou-heading-line ${isCenter ? "mx-auto" : ""}`}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
      {description && (
        <p className={`mt-4 text-sm sm:text-base leading-relaxed whitespace-pre-line ${dark ? "text-white/55" : "text-[#52615c]"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
