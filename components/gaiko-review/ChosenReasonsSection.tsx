import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { chosenReasonsContent, simulatorContent } from "@/data/gaiko-review/content";
import { ArticleContainer, FadeUp } from "./ui";
import CtaBlock from "./CtaBlock";

// このセクションから初めて高長建設を少し強く紹介する。ただし利用者側の感想として。
export default function ChosenReasonsSection() {
  return (
    <section className="py-12 sm:py-16" style={{ backgroundColor: "#566342" }} aria-labelledby="chosen-reasons-heading">
      <ArticleContainer>
        <FadeUp>
          <p className="mb-2 text-[11px] font-bold tracking-[0.24em] uppercase" style={{ color: "#DDEBD0" }}>
            Why we chose them
          </p>
          <h2
            id="chosen-reasons-heading"
            className="gr-font-serif text-balance text-[1.4rem] sm:text-[1.7rem] leading-[1.55] font-medium mb-6"
            style={{ color: "#FFFDF9" }}
          >
            {chosenReasonsContent.heading}
          </h2>

          <ul className="space-y-3 mb-10">
            {chosenReasonsContent.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl px-4 py-3.5"
                style={{ backgroundColor: "rgba(255,253,249,0.08)" }}
              >
                <Check size={18} className="shrink-0 mt-0.5" style={{ color: "#B7812D" }} aria-hidden />
                <span className="text-[15px] sm:text-base leading-relaxed" style={{ color: "#FFFDF9" }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </FadeUp>

        <FadeUp>
          <CtaBlock placement="after-chosen-reason" />
        </FadeUp>
      </ArticleContainer>
    </section>
  );
}
