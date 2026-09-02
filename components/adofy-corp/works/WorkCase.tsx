"use client";

import { ArrowRight } from "lucide-react";
import WorkImage from "@/components/adofy-corp/visuals/WorkImage";
import ScrollReveal from "@/components/adofy-corp/animations/ScrollReveal";

export type WorkCaseProps = {
  index: string;
  title: string;
  description: string;
  imageBase: string;
  imageAlt: string;
  href: string;
  /** Swaps which side the image sits on. Sizing stays identical either way. */
  reverse?: boolean;
};

/**
 * One case-study row: image and text always live in the same `<a>`, on the
 * same CSS Grid row, at the same two column widths for every case — only
 * `reverse` flips which column each side occupies. No per-card absolute
 * positioning, no per-card fixed heights; the row's height is just however
 * tall its content naturally is.
 */
export default function WorkCase({ index, title, description, imageBase, imageAlt, href, reverse = false }: WorkCaseProps) {
  return (
    <ScrollReveal y={24} duration={0.7}>
      <a
        href={href}
        className={`group grid items-center gap-8 lg:gap-12 ${
          reverse ? "lg:grid-cols-[1fr_1.3fr]" : "lg:grid-cols-[1.3fr_1fr]"
        }`}
      >
        <div className={`relative min-w-0 w-full lg:row-start-1 ${reverse ? "lg:col-start-2" : "lg:col-start-1"}`}>
          <WorkImage
            imageBase={imageBase}
            alt={imageAlt}
            placeholderLabel={`${title}の実績画像を準備中`}
            className="transition duration-500 group-hover:-translate-y-1"
          />
          <svg
            viewBox="0 0 28 28"
            className="pointer-events-none absolute -left-3 -top-3 h-7 w-7 text-accent-blue opacity-0 transition duration-300 group-hover:opacity-60"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M2 14 L2 2 L14 2" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>

        <div className={`min-w-0 lg:row-start-1 ${reverse ? "lg:col-start-1" : "lg:col-start-2"}`}>
          <span className="text-xs font-black uppercase tracking-widest text-accent-blue/50">
            {index} — Case Study
          </span>
          <p className="mt-3 text-3xl font-black tracking-tight text-ink md:text-5xl">{title}</p>
          <p className="mt-3 text-sm text-ink-soft">{description}</p>
          <p className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-accent-blue">
            実績を見る
            <ArrowRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-1" />
          </p>
        </div>
      </a>
    </ScrollReveal>
  );
}
