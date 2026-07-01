import { comparisonContent } from "@/data/gaiko-review/content";
import { ArticleContainer, BodyText, FadeUp, SectionHeading } from "./ui";
import CtaBlock from "./CtaBlock";

export default function ComparisonSection() {
  return (
    <section className="py-12 sm:py-16" style={{ backgroundColor: "#F8F4EC" }} aria-labelledby="comparison-heading">
      <ArticleContainer>
        <FadeUp>
          <SectionHeading id="comparison-heading">{comparisonContent.heading}</SectionHeading>

          <div className="space-y-5">
            {comparisonContent.rows.map((row) => (
              <div
                key={row.label}
                className="rounded-xl border p-5 sm:p-6"
                style={{ backgroundColor: "#FFFDF9", borderColor: "#DDD3C2" }}
              >
                <p className="text-[15px] sm:text-base font-bold mb-2.5" style={{ color: "#566342" }}>
                  {row.label}
                </p>
                <ul className="space-y-2">
                  {row.points.map((point) => (
                    <li
                      key={point}
                      className="text-[15px] leading-[1.8] pl-4 relative"
                      style={{ color: "#2E2923" }}
                    >
                      <span
                        className="absolute left-0 top-[0.75em] w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: "#879174" }}
                        aria-hidden
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p
            className="mt-7 rounded-xl px-5 py-4 text-[15px] sm:text-base font-bold leading-[1.75]"
            style={{ backgroundColor: "#2E2923", color: "#FFFDF9" }}
          >
            {comparisonContent.resultNote}
          </p>
          <BodyText className="mt-3 !text-xs sm:!text-sm" >
            <span style={{ color: "#879174" }}>{comparisonContent.disclaimer}</span>
          </BodyText>
        </FadeUp>

        <FadeUp className="mt-10">
          <CtaBlock placement="after-comparison" />
        </FadeUp>
      </ArticleContainer>
    </section>
  );
}
