import { directReasonsContent } from "@/data/gaiko-review/content";
import { ArticleContainer, BodyText, FadeUp, SectionHeading } from "./ui";

export default function DirectReasonsSection() {
  return (
    <section className="py-12 sm:py-16" style={{ backgroundColor: "#FFFDF9" }} aria-labelledby="direct-reasons-heading">
      <ArticleContainer>
        <FadeUp>
          <SectionHeading id="direct-reasons-heading">{directReasonsContent.heading}</SectionHeading>
        </FadeUp>

        <div className="space-y-10">
          {directReasonsContent.items.map((item) => (
            <FadeUp key={item.number}>
              <div className="flex items-start gap-4">
                <span
                  className="gr-font-serif shrink-0 text-2xl sm:text-3xl font-medium leading-none pt-0.5"
                  style={{ color: "#B7812D" }}
                  aria-hidden
                >
                  {item.number}
                </span>
                <div>
                  <h3 className="text-[16px] sm:text-[18px] font-bold mb-2.5" style={{ color: "#2E2923" }}>
                    {item.title}
                  </h3>
                  <BodyText>{item.body}</BodyText>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </ArticleContainer>
    </section>
  );
}
