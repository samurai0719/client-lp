import { finalSummaryContent } from "@/data/gaiko-review/content";
import { ArticleContainer, BodyText, FadeUp, SectionHeading } from "./ui";

export default function FinalSummarySection() {
  return (
    <section className="py-12 sm:py-16" style={{ backgroundColor: "#FFFDF9" }} aria-labelledby="final-summary-heading">
      <ArticleContainer>
        <FadeUp>
          <SectionHeading id="final-summary-heading">{finalSummaryContent.heading}</SectionHeading>
          <div className="space-y-5">
            {finalSummaryContent.paragraphs.map((p) => (
              <BodyText key={p}>{p}</BodyText>
            ))}
          </div>
        </FadeUp>
      </ArticleContainer>
    </section>
  );
}
