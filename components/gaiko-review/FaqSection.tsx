"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqContent, type FaqItem } from "@/data/gaiko-review/content";
import { ArticleContainer, FadeUp, SectionHeading } from "./ui";

function FaqRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  const panelId = `${item.id}-panel`;

  return (
    <div className="border-b" style={{ borderColor: "#DDD3C2" }}>
      <button
        type="button"
        className="w-full flex items-start justify-between gap-3 py-4 text-left bg-transparent"
        style={{ minHeight: "44px" }}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className="flex items-start gap-2.5 text-[15px] sm:text-base font-bold" style={{ color: "#2E2923" }}>
          <span aria-hidden style={{ color: "#B7812D" }}>
            Q
          </span>
          {item.question}
        </span>
        <ChevronDown
          size={20}
          className="shrink-0 mt-0.5 transition-transform duration-300"
          style={{ color: "#879174", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden
        />
      </button>
      <div
        id={panelId}
        style={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "grid-template-rows 0.28s ease",
        }}
      >
        <div className="overflow-hidden">
          <p
            className="text-[15px] sm:text-base leading-[1.9] pb-5 pl-6"
            style={{ color: "#2E2923" }}
          >
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FaqSection() {
  return (
    <section className="py-12 sm:py-16" style={{ backgroundColor: "#F8F4EC" }} aria-labelledby="faq-heading">
      <ArticleContainer>
        <FadeUp>
          <SectionHeading id="faq-heading">{faqContent.heading}</SectionHeading>
          <div className="rounded-2xl border px-4 sm:px-6" style={{ backgroundColor: "#FFFDF9", borderColor: "#DDD3C2" }}>
            {faqContent.items.map((item) => (
              <FaqRow key={item.id} item={item} />
            ))}
          </div>
        </FadeUp>
      </ArticleContainer>
    </section>
  );
}
