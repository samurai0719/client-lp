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
          <p className="mb-2.5 text-[11px] font-bold tracking-[0.24em] uppercase" style={{ color: "#DDEBD0" }}>
            Why we chose them
          </p>
          <h2
            id="chosen-reasons-heading"
            className="gr-font-serif text-balance text-[1.4rem] sm:text-[1.7rem] leading-[1.65] font-medium mb-7 sm:mb-9"
            style={{ color: "#FFFDF9", letterSpacing: "0.02em" }}
          >
            {chosenReasonsContent.heading}
          </h2>

          <ul className="space-y-3.5 mb-10">
            {chosenReasonsContent.items.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl px-4 py-4"
                style={{ backgroundColor: "rgba(255,253,249,0.08)" }}
              >
                <Check size={18} className="shrink-0 mt-0.5" style={{ color: "#B7812D" }} aria-hidden />
                <span className="text-[15px] sm:text-base leading-[1.75]" style={{ color: "#FFFDF9" }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </FadeUp>

        <FadeUp className="mb-10">
          <div
            className="rounded-2xl border p-5 sm:p-6"
            style={{ backgroundColor: "rgba(255,253,249,0.1)", borderColor: "rgba(255,253,249,0.25)" }}
          >
            <p
              className="mb-2 flex items-center gap-2 text-[13px] font-bold tracking-[0.1em]"
              style={{ color: "#EAD9A8" }}
            >
              <Sparkles size={16} aria-hidden />
              {simulatorContent.heading}
            </p>
            <p className="text-[15px] sm:text-base leading-[1.85] mb-4" style={{ color: "#FFFDF9" }}>
              {simulatorContent.body}
            </p>
            <Link
              href={simulatorContent.href}
              className="inline-flex items-center gap-1.5 text-sm font-bold underline underline-offset-4"
              style={{ color: "#EAD9A8" }}
            >
              {simulatorContent.linkLabel}
              <ArrowRight size={15} aria-hidden />
            </Link>
          </div>
        </FadeUp>

        <FadeUp>
          <CtaBlock placement="after-chosen-reason" />
        </FadeUp>
      </ArticleContainer>
    </section>
  );
}
