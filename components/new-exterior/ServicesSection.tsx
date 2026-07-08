"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { services } from "./data";
import NeSectionHeading from "./NeSectionHeading";
import ServiceIllust from "./svg/ServiceIllust";

export default function ServicesSection() {
  return (
    <section className="relative px-4 sm:px-6 py-16 md:py-24 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto">
        <NeSectionHeading
          eyebrow="対応工事"
          title={"対応できる工事内容"}
          description={"新築外構に必要な工事を、まとめてご相談いただけます"}
        />

        <div className="mt-10 md:mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              className="rounded-2xl bg-white overflow-hidden min-w-0 shadow-[0_3px_16px_rgba(70,66,50,0.08)]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.06, ease: "easeOut" }}
            >
              {/* 写真があれば写真、なければミニイラストを表示する */}
              {service.image ? (
                <div className="relative w-full aspect-[14/9]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[14/9] bg-[#fbf9f2]">
                  <ServiceIllust kind={service.illust} className="w-full h-full" />
                </div>
              )}
              <p
                className="px-3 py-2.5 sm:px-3.5 sm:py-3 text-center text-[13px] sm:text-[14.5px] font-bold text-[#2f3527] leading-snug border-t border-[#f0ece0]"
                style={{ overflowWrap: "anywhere" }}
              >
                {service.title}
              </p>
            </motion.div>
          ))}
        </div>

        <p className="mt-6 text-center text-[13px] sm:text-[14px] text-[#5f5f52]">
          「まだ決まっていない」段階でも、まとめてご相談いただけます。
        </p>
      </div>
    </section>
  );
}
